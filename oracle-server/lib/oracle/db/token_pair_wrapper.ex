defmodule Oracle.TokenPairWrapper do
  import Ecto.Query
  alias Oracle.TokenPair
  alias Oracle.Repo

  def create_token_pair(attrs \\ %{}) do
    %TokenPair{}
    |> TokenPair.changeset(attrs)
    |> Repo.insert()
  end

  def update_attr(%TokenPair{} = tokenPair, attrs) do
    tokenPair
    |> TokenPair.changeset(attrs)
    |> Repo.update()
  end

  def get_token_pair!(id) do
    Repo.get!(TokenPair, id)
  end

  def check_token_pair_exists(attrs) do
    if attrs.original_chain_id == 1 do
      query =
        from(t in TokenPair,
          where: t.sol_token_holder_account == ^attrs.token_id
        )
      Repo.exists?(query)
    else
      query =
        from(t in TokenPair,
          where: t.eth_token_id == ^attrs.token_id
        )
      Repo.exists?(query)
    end
  end

  def get_token_pair(attrs) do
    if attrs.original_chain_id == 1 do
      query =
        from(t in TokenPair,
          where: t.sol_token_holder_account == ^attrs.token_id
        )
      Repo.one(query)
    else
      query =
        from(t in TokenPair,
          where: t.eth_token_id == ^attrs.token_id
        )
      Repo.one(query)
    end
  end
end
