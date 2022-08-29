defmodule MyTest.DbTest do
  use Oracle.DataCase
  alias Oracle.Token
  alias Oracle.TokenWrapper
  alias Oracle.TokenPair
  alias Oracle.TokenPairWrapper

  describe "db test" do
    @valid_attrs %{
      chain_id: 1,
      owner_address: "5bwCPYuSyZrhkeibVWeZr7Ah33xUiT4d7ahJcsqsEwZK",
      recipient_address: "0xfd779b9b1176EF1EB69a8fAD435014dbC55edB3f",
      nft_token_id: "DKM29wEFosFRgJbixRTz7Ds4HApp1ATM8s8Sg4vLG1gv",
      token_holder_account: "8uoNz86PHkhP9TvCjA3hhzHxfnk1YiHdx4Z5SBwsaNfZ",
      status: "new"
    }

    @valid_attrs2 %{
      chain_id: 2,
      owner_address: "5bwCPYuSyZrhkeibVWeZr7Ah33xUiT4d7ahJcsqsEwZK",
      # recipient_address: "",
      nft_token_id: "1",
      # token_holder_account: "",
      status: "new"
    }

    test "create new token" do
      assert {:ok, %Token{} = token} = TokenWrapper.create_token(@valid_attrs2)
      assert token.chain_id == 2
      # assert token.owner_address == "5bwCPYuSyZrhkeibVWeZr7Ah33xUiT4d7ahJcsqsEwZK"
      assert token.recipient_address == nil
      # assert token.nft_token_id == "DKM29wEFosFRgJbixRTz7Ds4HApp1ATM8s8Sg4vLG1gv"
      # assert token.token_holder_account == "8uoNz86PHkhP9TvCjA3hhzHxfnk1YiHdx4Z5SBwsaNfZ"
      # assert token.status == "new"
    end

    test "update status" do
      assert {:ok, %Token{} = token} = TokenWrapper.update_status!(1, "deposit")
      assert token.status == "deposit"
    end

    test "get tokens by chain_id" do
      solana_chain_id = 1
      eth_chain_id = 2
      tokens = TokenWrapper.get_tokens_by_chain_id(solana_chain_id)
      # assert length(tokens) == 2
      Enum.map(tokens, fn x ->
        assert x.status == "received"
      end)
    end

    test "check token exits" do
      query_result = TokenWrapper.check_token_exists(@valid_attrs)
      assert query_result == true
    end

    test "check token_pair exits" do
      valid_pair_attrs = %{
        original_chain_id: 1,
        token_id: "8uoNz86PHkhP9TvCjA3hhzHxfnk1YiHdx4Z5SBwsaNfZ"
      }
      query_result = TokenPairWrapper.check_token_pair_exists(valid_pair_attrs)
      assert query_result == true
    end
  end
end
