import { ethers } from "hardhat";
import { save, load } from "../utils"

async function main() {
  const nftContractAddress = (await load('nftContract')).address
  const factory = await ethers.getContractFactory("HolderContract");
  let contract = await factory.deploy(nftContractAddress);

  await contract.deployed();
  await save('holderContract', {
    address: contract.address
  });

  console.log(contract.address);
  console.log(contract.deployTransaction.hash);

}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });