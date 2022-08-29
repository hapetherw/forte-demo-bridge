defmodule Oracle.TokenPair do
  use Ecto.Schema
  import Ecto.Changeset

  schema "token_pairs" do
    field(:original_chain_id, :integer)
    field(:eth_token_id, :integer)
    field(:sol_token_holder_account, :string)
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
      :original_chain_id,
      :eth_token_id,
      :sol_token_holder_account
    ])
    |> validate_required([
      :original_chain_id,
      :eth_token_id,
      :sol_token_holder_account
    ])
  end
end
