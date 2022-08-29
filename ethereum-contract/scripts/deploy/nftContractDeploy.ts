import { ethers } from "hardhat";
import { save } from "../utils"

async function main() {
  const factory = await ethers.getContractFactory("NFTContract");
  let contract = await factory.deploy();

  await contract.deployed();
  await save('nftContract', {
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