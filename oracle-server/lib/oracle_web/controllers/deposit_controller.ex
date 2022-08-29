defmodule OracleWeb.DepositController do
  use OracleWeb, :controller
  alias Oracle.TokenWrapper

  def deposit(conn, params) do

    token_id = params["nft_token_id"]
    if is_integer(token_id) do
      token_id = Integer.to_string(token_id)
    end

    valid_attrs = %{
      chain_id: params["chain_id"],
      owner_address: params["owner_address"],
      recipient_address: params["recipient_address"],
      nft_token_id: token_id,
      token_holder_account: params["token_holder_account"],
      status: "new"
    }

    is_token_exist = TokenWrapper.check_token_exists(valid_attrs)

    if is_token_exist do
      json(conn, %{result: "record exists"})
    else
      case TokenWrapper.create_token(valid_attrs) do
        {:ok, _} ->
          json(conn, %{result: "new record"})

        {:error, _} ->
          json(conn, %{data: %{"error" => "ERROR!"}})
      end
    end

  end
end
