import { ethers } from 'hardhat';
import { formatUnits } from "ethers/lib/utils";
import { HolderContract, NFTContract } from "../typechain-types";

import 'dotenv/config';
import { load } from "./utils"
import {
  getBigNumber,
} from '../test/utils'

import { Signer } from 'ethers';

async function main () {
  let signer: Signer
  let nftContract: NFTContract

  const walletAddress = String(process.env.WALLET_ADDRESS)
  // pingpong tokenURI
  // const tokenURI = "https://arweave.net/B4T7noSr8mhPCekdMKWQI2haqnHrjsdJOwWG8I7fVbw"

  // SMB tokenURI
  // const tokenURI = "https://arweave.net/cmgR4zAfjNdixGYzFR3WY-VdwjZ53rb8okqytNyEz30"
  const tokenURI = "https://bafybeid2dmxjcxxkkd4rla7i3rq7mocgszawzbll6w4qiu7a2il72kltbm.ipfs.nftstorage.link/3.json"

  const nftContractAddress = (await load('nftContract')).address
  const holderContractAddress = (await load('holderContract')).address

  nftContract = (await ethers.getContractAt("NFTContract", nftContractAddress)) as NFTContract;
  [signer] = await ethers.getSigners()

  // let currentTokenId = Number(formatUnits(await nftContract.getCurrentTokenId(), 0));
  await nftContract
    .connect(signer)
    .mintToken(
      walletAddress, 
      tokenURI
    )

  console.log(
    "NFT count is: ", 
    formatUnits(
      await nftContract.balanceOf(
        walletAddress
      ),
      0
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });