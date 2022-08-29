defmodule Oracle.Repo.Migrations.CreateTokenIdPairs do
  use Ecto.Migration

  def change do
    create table(:token_pairs) do
      add :original_chain_id, :integer
      add :eth_token_id, :integer
      add :sol_token_holder_account, :string
      timestamps()
    end
  end
end
