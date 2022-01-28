/**
    This is a basic mintable NFT with restricted minting capabilities.
    
    Only the owner can mint new NFTs. 
    
    The code uses the Open Zeppelin framework.

    You can play with this tool to learn more:

    https://docs.openzeppelin.com/contracts/4.x/wizard
 */

// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintableNFT is ERC721, Ownable {
    constructor() ERC721("MintableNFT", "MintableNFT") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}
