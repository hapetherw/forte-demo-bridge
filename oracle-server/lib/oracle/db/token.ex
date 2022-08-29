defmodule Oracle.Token do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tokens" do
    field(:chain_id, :integer)
    field(:owner_address, :string)
    field(:recipient_address, :string)
    field(:nft_token_id, :string)
    field(:token_holder_account, :string)
    field(:status, :string)
    timestamps()
  end

  @spec changeset(
          {map, map}
          | %{
              :__struct__ => atom | %{:__changeset__ => map, optional(any) => any},
              optional(atom) => any
            },
          :invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}
        ) :: Ecto.Changeset.t()
  @doc false
  def changeset(token, attrs) do
    token
    |> cast(attrs, [
      :chain_id,
      :owner_address,
      :recipient_address,
      :nft_token_id,
      :token_holder_account,
      :status
    ])
    |> validate_required([
      :chain_id,
      :owner_address,
      # :recipient_address,
      :nft_token_id,
      # :token_holder_account,
      :status
    ])
  end
end
