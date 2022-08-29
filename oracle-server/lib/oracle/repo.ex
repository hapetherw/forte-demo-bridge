defmodule Oracle.Repo do
  use Ecto.Repo,
    otp_app: :oracle,
    adapter: Ecto.Adapters.Postgres
end
