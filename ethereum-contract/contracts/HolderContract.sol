// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract HolderContract is IERC721Receiver {

    event Transferred(address indexed to, uint256 tokenId);
    event Approved(address indexed to, uint256 tokenId);

    IERC721 public iNFTContract;

    constructor(address _nftContract) {
        iNFTContract = IERC721(_nftContract);
    }

    /**
     * @dev Define onERC721Received for safeTransferFrom
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /**
     * @dev Transfer NFT using SafeTransferFrom
     */
    function transfer(address to, uint256 tokenId) external {
        require(to.code.length == 0, "Can not transfer NFT to contract address");
        iNFTContract.transferFrom(address(this), to, tokenId);
        emit Transferred(to, tokenId);
    }
}