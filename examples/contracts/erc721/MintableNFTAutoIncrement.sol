/**
    This is a basic mintable NFT with auto increment token id capabilities that uses the Open Zeppelin framework.

    Notice how safeMint is permissionless

    You can play with this tool to learn more:

    https://docs.openzeppelin.com/contracts/4.x/wizard
 */

// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintableNFTAutoIncrement is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MyNFT", "MyNFT") {}

    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
}
