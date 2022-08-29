import { Contract, providers } from "ethers";
import { abi } from "./artifacts/NFTContract.json";
import 'dotenv/config';

exports.getTokenURI = async (contractAddress: string, tokenId: number) => {
  const provider =  await new providers.JsonRpcProvider( "https://eth-rinkeby.alchemyapi.io/v2/nKqhgMRUZJSw0baczgK177tpL59bae_j");

  const nftContract = new Contract(contractAddress, abi, provider);
  const tokenURI = await nftContract.tokenURI(tokenId);
  console.log(tokenURI);
  return tokenURI;
};