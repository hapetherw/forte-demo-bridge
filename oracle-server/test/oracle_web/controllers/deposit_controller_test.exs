defmodule OracleWeb.DepositControllerTest do
  use OracleWeb.ConnCase
  @custodial_address "asdfasdfasdf"
  test "POST /api/deposit", %{conn: conn} do
    conn = post(conn, "/api/deposit")

    assert %{
             "custodial_wallet_address" => @custodial_address
           } = json_response(conn, 200)["data"]
  end
end
