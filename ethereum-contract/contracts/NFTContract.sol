// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTContract is ERC721URIStorage, Ownable {

    event MintToken(address indexed to, string tokenURI, uint256 tokenId);
    
    using Counters for Counters.Counter;
    Counters.Counter private _currentTokenId;

    constructor() ERC721("NFTContract", "NFT") {}

    /**
     * @dev Mint NFT
     */
    function mintToken(address to, string calldata tokenURI) external onlyOwner {
        require(to != address(0), "Should not be zero address");
        require(to.code.length == 0, "Should not be contract address");
        _currentTokenId.increment();
        uint256 newItemId = _currentTokenId.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit MintToken(to, tokenURI, newItemId);
    }
    
    /**
     * @dev Retrieve current token id
     */
    function getCurrentTokenId() view external returns(uint256) {
        return _currentTokenId.current();
    }
}