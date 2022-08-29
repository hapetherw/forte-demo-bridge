import { expect } from 'chai';
import { ethers } from 'hardhat';
const hre = require("hardhat");
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { HolderContract, NFTContract } from "../typechain-types";

import {
  getBigNumber,
} from './utils'
import { BigNumber, Contract, Signer } from 'ethers';

describe('BootcampContract-test', () => {
  let nftContract: NFTContract
  let holderContract: HolderContract
  let owner: Signer
  let addr: Signer
  let nftOwner: Signer

  let ownerAddress: string
  let nftOwnerAddress: string

  const tokenURI1 = "https://gateway.pinata.cloud/ipfs/QmewutKbD5zw88HYsr5CwP3HgBdP7DPGqwZKouG3T28qRp/1.json"
  const tokenURI2 = "https://gateway.pinata.cloud/ipfs/QmewutKbD5zw88HYsr5CwP3HgBdP7DPGqwZKouG3T28qRp/2.json"
  const tokenURI3 = "https://gateway.pinata.cloud/ipfs/QmewutKbD5zw88HYsr5CwP3HgBdP7DPGqwZKouG3T28qRp/3.json"
  
  before(async () => {
    [owner, addr, nftOwner] = await ethers.getSigners()
    ownerAddress = await owner.getAddress()
    nftOwnerAddress = await nftOwner.getAddress()

    console.log('===================Deploying Contracts=====================')

    const contractFactory1 = await ethers.getContractFactory("NFTContract")
    nftContract = (await contractFactory1.deploy()) as NFTContract
    await nftContract.deployed()
    console.log('nftContract deployed')
    
    const contractFactory2 = await ethers.getContractFactory("HolderContract")
    holderContract = (await contractFactory2.deploy(
      nftContract.address
    )) as HolderContract
    await holderContract.deployed()
    console.log('holderContract deployed')
  })

  describe('NFT Mint test', async () => {
    it('Only owner can call mint function', async () => {
      await expect(
        nftContract.connect(addr).mintToken(nftOwnerAddress, tokenURI1)
      ).to.be.reverted;
    })

    it('Should not be zero address', async () => {
      await expect(
        nftContract.mintToken(ethers.constants.AddressZero, tokenURI1)
      ).to.be.revertedWith("Should not be zero address");
    })

    it('Mint NFT', async () => {
      const nftCountBefore = formatUnits(await nftContract.balanceOf(nftOwnerAddress), 0);
      console.log("nft count before mint: ", nftCountBefore);
      expect(nftCountBefore).to.be.equal("0");
      await nftContract.mintToken(nftOwnerAddress, tokenURI1)
      await nftContract.mintToken(nftOwnerAddress, tokenURI2)
      await nftContract.mintToken(nftOwnerAddress, tokenURI3)
      const nftCountAfter = formatUnits(await nftContract.balanceOf(nftOwnerAddress), 0);
      console.log("nft count after mint: ", nftCountAfter);
      expect(nftCountAfter).to.be.equal("3");
    })
  })

  describe('Lock NFT test', async () => {
    it('Shold approve NFT before transfer', async () => {
      await expect(
        nftContract['safeTransferFrom(address,address,uint256)'](nftOwnerAddress, holderContract.address, 1)
      ).to.be.reverted;
    })
    
    it('approve NFT', async () => {
      await nftContract.connect(nftOwner).approve(holderContract.address, 1)
      await nftContract.connect(nftOwner).approve(holderContract.address, 2)
      await nftContract.connect(nftOwner).approve(holderContract.address, 3)
    })

    it('Can not transfer NFT to EOA', async () => {
      await expect(
        nftContract['safeTransferFrom(address,address,uint256)'](nftOwnerAddress, ownerAddress, 1)
      ).to.be.reverted;
    })

    it('Tranfer NFT to lock contract', async () => {
      const nftCountBefore = formatUnits(await nftContract.balanceOf(holderContract.address), 0);
      console.log("nft count before transfer: ", nftCountBefore);
      expect(nftCountBefore).to.be.equal("0");
      await nftContract.connect(nftOwner)['safeTransferFrom(address,address,uint256)'](nftOwnerAddress, holderContract.address, 1);
      await nftContract.connect(nftOwner)['safeTransferFrom(address,address,uint256)'](nftOwnerAddress, holderContract.address, 2);
      await nftContract.connect(nftOwner)['safeTransferFrom(address,address,uint256)'](nftOwnerAddress, holderContract.address, 3);
      const nftCountAfter = formatUnits(await nftContract.balanceOf(holderContract.address), 0);
      console.log("nft count after transfer: ", nftCountAfter);
      expect(nftCountAfter).to.be.equal("3");
    })
  })

  describe('NFT unlock test', async () => {

    it('NFT unlock', async () => {
      const nftCountBefore = formatUnits(await nftContract.balanceOf(nftOwnerAddress), 0);
      console.log("nft count before transfer: ", nftCountBefore);
      expect(nftCountBefore).to.be.equal("0");
      await holderContract.connect(nftOwner).transfer(nftOwnerAddress, 1);
      await holderContract.connect(nftOwner).transfer(nftOwnerAddress, 2);
      await holderContract.connect(nftOwner).transfer(nftOwnerAddress, 3);
      const nftCountAfter = formatUnits(await nftContract.balanceOf(nftOwnerAddress), 0);
      console.log("nft count after transfer: ", nftCountAfter);
      expect(nftCountAfter).to.be.equal("3");
    })
  })
});
