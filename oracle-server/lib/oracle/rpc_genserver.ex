defmodule Oracle.RpcGenserver do
  use GenServer
  require Logger

  alias Oracle.{TokenWrapper, EthereumUtils, Common, TokenPairWrapper}
  alias Ethereumex.HttpClient

  @eth_nft_contract_path Application.get_env(:oracle, OracleWeb.Endpoint)[:eth_nft_contract_path]
  @eth_holder_contract_path Application.get_env(:oracle, OracleWeb.Endpoint)[:eth_holder_contract_path]
  @eth_owner_address System.get_env("ETH_OWNER_ADDRESS")
  @eth_owner_pk System.get_env("ETH_OWNER_PRIVATE_KEY")
  @solana_chain_id 1
  @eth_chain_id 2
  @eth_block_gas_limit 300_000
  @solana_owner_pk System.get_env("SOLANA_OWNER_PRIVATE_KEY")
  @solana_lock_contract_program_id System.get_env("SOLANA_LOCK_CONTRACT_PROGRAM_ID")
  @solana_lock_contract_ata System.get_env("SOLANA_LOCK_CONTRACT_ATA")

  def start_link(_) do
    GenServer.start_link(__MODULE__, %{})
  end

  @impl true
  def init(state) do
    Logger.info("Genserver init")

    nft_contract_path =
      System.cwd()
      |> Path.join(@eth_nft_contract_path)
      |> Path.expand()

    {:ok, nft_contract_address} = Common.get_json(nft_contract_path)
    # IO.inspect(nft_contract_address["address"])

    holder_contract_path =
      System.cwd()
      |> Path.join(@eth_holder_contract_path)
      |> Path.expand()

    {:ok, holder_contract_address} = Common.get_json(holder_contract_path)
    # IO.inspect(holder_contract_address["address"])

    schedule_work()

    {:ok, [nft_contract_address["address"], holder_contract_address["address"]]}
  end

  @impl true
  def handle_info(:work, contract_address_list) do
    Logger.info("Genserver listening...")
    solana_network = Application.get_env(:oracle, OracleWeb.Endpoint)[:solana_network]
    solana_rpc_client = Solana.RPC.client(network: solana_network)
    solana_pending_tokens = TokenWrapper.get_tokens_by_chain_id(@solana_chain_id)
    eth_pending_tokens = TokenWrapper.get_tokens_by_chain_id(@eth_chain_id)

    Enum.map(solana_pending_tokens, fn t ->
      case check_user_nft_balance(solana_rpc_client, t.token_holder_account) do
        {:ok, data} ->
          nft_balance = String.to_integer(data["amount"])

          if nft_balance == 0 do
            Logger.info("User deposited Metaplex-NFT in the solana holder program")
            if is_token_minted_on_chain(
              @solana_chain_id,
              t.token_holder_account
            ) do
              Logger.info("NFT is already minted and locked in the Ethereum holder contract")
              token_pair = %{
                original_chain_id: @solana_chain_id,
                token_id: t.token_holder_account
              }
              |> TokenPairWrapper.get_token_pair()

              eth_token_transfer(
                List.last(contract_address_list),
                t.recipient_address,
                token_pair.eth_token_id
              )
              Logger.info("Transferred NFT from holder contract to user wallet in the Ethereum chain")
            else
              Logger.info("NFT is not minted yet in the Ethereum chain")

              metadata =
                t.nft_token_id
                |> get_metadata_pda()
                |> get_decode_metadata()
              Logger.info("Metadata URI parsed from Metaplex-NFT: #{metadata["data"]["uri"]}")

              current_token_id = get_current_token_id_eth(List.first(contract_address_list))

              mint_eth_nft(
                List.first(contract_address_list),
                t.recipient_address,
                metadata["data"]["uri"]
              )

              %{
                original_chain_id: 1,
                sol_token_holder_account: t.token_holder_account,
                eth_token_id: current_token_id + 1
              }
              |> TokenPairWrapper.create_token_pair()
              # res1 = get_balance_of_eth(List.first(contract_address_list), t.recipient_address)
              # Logger.info("Token balance is #{res1}")
              Logger.info("Minted NFT in the Ethereum chain")
            end
            TokenWrapper.update_status!(t.id, "sent")
          else
            Logger.info("Not deposited NFT in the Solana lock contract")
          end

        {:error, _} ->
          Logger.warning("Error check_nft_balance")
      end
    end)

    Enum.map(eth_pending_tokens, fn t ->
      if check_holder_contract_has_nft(List.first(contract_address_list), List.last(contract_address_list), t.nft_token_id) do
        Logger.info("User deposited NFT in the Ethereum holder contrat")

        if is_token_minted_on_chain(
          @eth_chain_id,
          t.nft_token_id
        ) do
          Logger.info("NFT is already minted and locked in the Solana lock program")

          token_pair = %{
            original_chain_id: @eth_chain_id,
            token_id: t.nft_token_id
          }
          |> TokenPairWrapper.get_token_pair()

          unlock_solana_nft(token_pair.sol_token_holder_account)

          Logger.info("Transferred NFT from lock program to user wallet in the Solana network")
        else
          Logger.info("NFT is not minted yet in the Solana network")

          token_uri = get_token_uri_eth(List.first(contract_address_list), t.nft_token_id)

          metaplex_nft_info = mint_metaplex_nft(token_uri)

          %{
            original_chain_id: 2,
            sol_token_holder_account: List.last(metaplex_nft_info),
            eth_token_id: t.nft_token_id
          }
          |> TokenPairWrapper.create_token_pair()

          Logger.info("Minted NFT in the Solana network")
        end
        TokenWrapper.update_status!(t.id, "sent")

      else
        Logger.info("User not deposited NFT in Ethereum holder contract")
      end
    end)

    schedule_work()

    {:noreply, contract_address_list}
  end

  defp schedule_work do
    Process.send_after(self(), :work, 5_000)
  end

  defp get_current_token_id_eth(contract_address) do
    {:ok, result_bytes} =
      HttpClient.eth_call(%{
        data:
          EthereumUtils.get_encode_data("getCurrentTokenId()", []),
        to: contract_address
      })

    EthereumUtils.hex_to_integer(result_bytes)
  end

  defp get_token_uri_eth(contract_address, token_id) do
    # {:ok, result_bytes} =
    #   HttpClient.eth_call(%{
    #     data:
    #       EthereumUtils.get_encode_data("tokenURI(uint256)", [
    #         String.to_integer(token_id)
    #       ]),
    #     to: contract_address
    #   })
    # IO.inspect(result_bytes)
    # res1 = EthereumUtils.bytes_to_string(result_bytes)
    # IO.inspect(res1)
    # res1
    res1 = NodeJS.call!({"ethereum-contract", "getTokenURI"}, [contract_address, String.to_integer(token_id)])
    IO.inspect(res1)
    res1
  end

  defp check_holder_contract_has_nft(contract_address, holder_contract_address, token_id) do
    {:ok, result_owner_bytes} =
      HttpClient.eth_call(%{
        data:
          EthereumUtils.get_encode_data("ownerOf(uint256)", [
            String.to_integer(token_id)
          ]),
        to: contract_address
      })

    token_owner = EthereumUtils.bytes_to_address(result_owner_bytes)
    if String.downcase(token_owner) == String.downcase(holder_contract_address) do
      true
    else
      false
    end
  end

  defp is_token_minted_on_chain(chain_id, token_id) do
    token_pair_attrs = %{
      original_chain_id: chain_id,
      token_id: token_id
    }
    if TokenPairWrapper.check_token_pair_exists(token_pair_attrs) do
      true
    else
      false
    end
  end

  defp eth_token_transfer(contract_address, recipient_address, token_id) do
    encode_data = EthereumUtils.get_encode_data("transfer(address, uint256)", [
      EthereumUtils.address_to_bytes(recipient_address),
      token_id
    ])
    %{
      from: @eth_owner_address,
      to: contract_address,
      nonce: get_transaction_count() |> EthereumUtils.integer_to_hex(),
      gas_limit: @eth_block_gas_limit |> EthereumUtils.integer_to_hex(),
      gas_price: gas_price() * 10 |> EthereumUtils.integer_to_hex(),
      value: "",
      data: encode_data
    }
    |> ETH.sign_transaction(@eth_owner_pk)
    |> Base.encode16(case: :lower)
    |> EthereumUtils.hex_prefix()
    |> HttpClient.eth_send_raw_transaction()
  end

  defp check_user_nft_balance(client, token_holder_account) do
    req = {"getTokenAccountBalance", [token_holder_account]}
    Solana.RPC.send(client, req)
  end

  defp get_metadata_pda(nft_token_id) do
    pda = NodeJS.call!({"metadata", "getMetadata"}, [nft_token_id])
    # pda = NodeJS.call!({"metadata1", "getMetadata"}, [nft_token_id])
    Logger.info("Metadata PDA is: #{pda}")
    pda
  end

  defp get_decode_metadata(pda) do
    metadata = NodeJS.call!({"metadata", "decodeMetadata"}, [pda])
    # metadata = NodeJS.call!({"metadata1", "decodeMetadata"}, [pda])
    metadata
  end

  defp mint_metaplex_nft(token_uri) do
    mint_result = NodeJS.call!({"metaplex-mint", "mintMetaplexNFT"}, [token_uri, @solana_owner_pk])
    mint_result
  end

  defp unlock_solana_nft(token_holder_account) do
    NodeJS.call!({"solana-nftunlock", "unlockMetaplexNft"}, [
      @solana_lock_contract_program_id,
      @solana_lock_contract_ata,
      @solana_owner_pk,
      token_holder_account
    ])
  end

  defp get_balance_of_eth(contract_address, address) do
    {:ok, result_bytes} =
      HttpClient.eth_call(%{
        data:
          EthereumUtils.get_encode_data("balanceOf(address)", [
            EthereumUtils.address_to_bytes(address)
          ]),
        to: contract_address
      })

    EthereumUtils.hex_to_integer(result_bytes)
  end

  defp mint_eth_nft(contract_address, recipient_address, token_uri) do
    encode_data = EthereumUtils.get_encode_data("mintToken(address, string)", [
      EthereumUtils.address_to_bytes(recipient_address),
      token_uri
    ])
    %{
      from: @eth_owner_address,
      to: contract_address,
      nonce: get_transaction_count() |> EthereumUtils.integer_to_hex(),
      gas_limit: @eth_block_gas_limit |> EthereumUtils.integer_to_hex(),
      gas_price: gas_price() * 10 |> EthereumUtils.integer_to_hex(),
      value: "",
      data: encode_data
    }
    |> ETH.sign_transaction(@eth_owner_pk)
    |> Base.encode16(case: :lower)
    |> EthereumUtils.hex_prefix()
    |> HttpClient.eth_send_raw_transaction()

    # IO.inspect(res1)
  end

  def gas_price do
    case HttpClient.eth_gas_price() do
      {:ok, gas_price} -> EthereumUtils.hex_to_integer(gas_price)
      error -> error
    end
  end

  def get_transaction_count() do
    {:ok, count} = HttpClient.eth_get_transaction_count(@eth_owner_address, "pending")
    EthereumUtils.hex_to_integer(count)
  end
end
