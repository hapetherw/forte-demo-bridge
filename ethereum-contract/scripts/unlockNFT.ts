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
  let holderContract: HolderContract

  const walletAddress = String(process.env.WALLET_ADDRESS)
  const nftContractAddress = (await load('nftContract')).address
  const holderContractAddress = (await load('holderContract')).address

  nftContract = (await ethers.getContractAt("NFTContract", nftContractAddress)) as NFTContract;
  holderContract = (await ethers.getContractAt("HolderContract", holderContractAddress)) as HolderContract;
  [signer] = await ethers.getSigners()
  
  let currentTokenId = Number(formatUnits(await nftContract.getCurrentTokenId(), 0));

  const nftCountBefore = formatUnits(await nftContract.balanceOf(walletAddress), 0);
  console.log("nft count before transfer: ", nftCountBefore);
  await holderContract
    .connect(signer)
    .transfer(
      walletAddress, 
      currentTokenId
    );
  const nftCountAfter = formatUnits(await nftContract.balanceOf(walletAddress), 0);
  console.log("nft count after transfer: ", nftCountAfter);

  console.log(
    "NFT count is: ", 
    formatUnits(
      await nftContract.balanceOf(
        String(process.env.WALLET_ADDRESS)
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