defmodule OracleWeb.PageController do
  use OracleWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
