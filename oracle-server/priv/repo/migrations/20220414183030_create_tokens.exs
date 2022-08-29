defmodule Oracle.Repo.Migrations.CreateTokens do
  use Ecto.Migration

  def change do
    create table(:tokens) do
      add :chain_id, :integer
      add :owner_address, :string
      add :recipient_address, :string, null: true, default: nil
      add :nft_token_id, :string
      add :token_holder_account, :string, null: true, default: nil
      add :status, :string, default: "new"
      timestamps()
    end
  end
end
