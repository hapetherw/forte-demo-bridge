defmodule Oracle.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application
  use Supervisor
  @impl true
  def start(_type, _args) do
    ts_path =
      System.cwd()
      |> Path.join("nodejs/build")

    children = [
      # Start the Ecto repository
      Oracle.Repo,
      # Start the Telemetry supervisor
      OracleWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Oracle.PubSub},
      # Start the Endpoint (http/https)
      OracleWeb.Endpoint,
      # Start a worker by calling: Oracle.Worker.start_link(arg)
      # {Oracle.Worker, arg}
      Oracle.RpcGenserver,
      %{id: NodeJS, start: {NodeJS, :start_link, [[path: ts_path, pool_size: 4]]}}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Oracle.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    OracleWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
