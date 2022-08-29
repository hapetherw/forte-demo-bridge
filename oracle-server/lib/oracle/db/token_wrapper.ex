defmodule Oracle.TokenWrapper do
  import Ecto.Query
  alias Oracle.Token
  alias Oracle.Repo

  def create_token(attrs \\ %{}) do
    %Token{}
    |> Token.changeset(attrs)
    |> Repo.insert()
  end

  def update_attr(%Token{} = token, attrs) do
    token
    |> Token.changeset(attrs)
    |> Repo.update()
  end

  def update_status!(table_id, new_status) do
    # Repo.get_by!(Token, id: table_id)
    # |> change(%{status: new_status})
    # |> Repo.update()

    Repo.get_by!(Token, id: table_id)
    |> Token.changeset(%{status: new_status})
    |> Repo.update()
  end

  def get_token!(id) do
    Repo.get!(Token, id)
  end

  def check_token_exists(attrs) do
    query =
      from(t in Token,
        where: (t.status == "new" or t.status == "received")
        and t.chain_id == ^attrs.chain_id
        and t.owner_address == ^attrs.owner_address
        and t.recipient_address == ^attrs.recipient_address
        and t.nft_token_id == ^attrs.nft_token_id
        and t.token_holder_account == ^attrs.token_holder_account
      )

    Repo.exists?(query)
  end

  def get_tokens_by_chain_id(chain_id) do
    query =
      from(t in Token,
        where: (t.status == "new" or t.status == "received") and t.chain_id == ^chain_id,
        order_by: [asc: :id]
      )

    Repo.all(query)
  end
end
