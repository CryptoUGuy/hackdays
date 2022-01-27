/**
    Simplest NFT you ever imagine.

    The code uses the Open Zeppelin framework.

    You can play with this tool to learn more:

    https://docs.openzeppelin.com/contracts/4.x/wizard
 */

// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleNFT is ERC721 {
    constructor() ERC721("SimpleNFT", "SimpleNFT") {}
}
