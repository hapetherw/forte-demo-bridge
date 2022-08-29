defmodule Oracle.EthereumUtils do
  def get_encode_data(method, params) do
    encode_data =
      ABI.encode(method, params)
      |> Base.encode16(case: :lower)

    "0x" <> encode_data
  end

  def address_to_bytes(address) do
    address
    |> String.slice(2..-1)
    |> Base.decode16!(case: :mixed)
  end

  def bytes_to_address(bytes) do
    bytes
    |> String.slice(2..-1)
    |> String.slice(24..-1)
    |> hex_prefix()
  end

  def bytes_to_string(bytes) do
    bytes
    |> String.slice(2..-1)
    |> Base.encode16(case: :lower)
    |> String.replace_trailing("0", "")
    |> Base.decode16!(case: :lower)
  end

  def bytes_to_integer(result_bytes) do
    result_bytes
    |> String.slice(2..-1)
    |> Base.decode16!(case: :lower)
    |> TypeDecoder.decode_raw([{:uint, 256}])
    |> List.first()
  end

  def hex_to_integer(hex) do
    case hex do
      "0x" <> hex -> String.to_integer(hex, 16)
    end
  end

  def integer_to_hex(number) do
    "0x" <> Integer.to_string(number, 16)
  end

  def hex_prefix(str), do: "0x#{str}"
end
