import hre from "hardhat";
import { ethers } from 'hardhat'
import { load } from "../utils"

async function main() {
  const contractAddress = (await load('nftContract')).address
  await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});