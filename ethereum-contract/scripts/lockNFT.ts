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
  const nftContractAddress = (await load('nftContract')).address
  const holderContractAddress = (await load('holderContract')).address

  nftContract = (await ethers.getContractAt("NFTContract", nftContractAddress)) as NFTContract;
  [signer] = await ethers.getSigners()
  
  let currentTokenId = Number(formatUnits(await nftContract.getCurrentTokenId(), 0));

  const nftCountBefore = formatUnits(await nftContract.balanceOf(walletAddress), 0);
  console.log("nft count before lock: ", nftCountBefore);
  await nftContract
    .connect(signer)['safeTransferFrom(address,address,uint256)'](
      walletAddress, 
      holderContractAddress, 
      currentTokenId
    );
  const nftCountAfter = formatUnits(await nftContract.balanceOf(walletAddress), 0);
  console.log("nft count after lock: ", nftCountAfter);

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