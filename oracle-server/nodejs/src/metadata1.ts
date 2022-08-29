/*
@nfteyez/sol-rayz npm library
https://www.npmjs.com/package/@nfteyez/sol-rayz?activeTab=readme
*/

import {
  decodeTokenMetadata,
  getSolanaMetadataAddress
} from "@nfteyez/sol-rayz";
import { Connection, PublicKey } from "@solana/web3.js";

const METADATA_REPLACE = new RegExp("\u0000", "g");

exports.decodeMetadata = async (pda: string) => {
  try {
    const pdaPubKey = new PublicKey(pda);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
    const buffer = await connection.getAccountInfo(pdaPubKey);
    const metadataInfo = await decodeTokenMetadata(buffer.data);
    metadataInfo.data.name = metadataInfo.data.name.replace(METADATA_REPLACE, "");
    metadataInfo.data.uri = metadataInfo.data.uri.replace(METADATA_REPLACE, "");
    metadataInfo.data.symbol = metadataInfo.data.symbol.replace(METADATA_REPLACE, "");
    return metadataInfo;
  } catch (error) {
    console.log("Error thrown, while fetching NFTs", error.message);
  }
};

exports.getMetadata = async (tokenMint: string) => {
  try {
    const mintPubKey = new PublicKey(tokenMint)
    const pda = await getSolanaMetadataAddress(mintPubKey);
    console.log("Metadata PDA is:", pda.toBase58());
    
    return pda.toBase58();
  } catch (error) {
    console.log("Error thrown, while fetching NFTs", error.message);
  }
}