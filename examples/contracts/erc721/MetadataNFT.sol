/**
    We include metadata to our NFT. 

    As per the EIP-721 https://eips.ethereum.org/EIPS/eip-721

    The metadata extension allow our smart contract to be interrogated for extra details about
    the assets our NFT represent.
    
    The metadata can be also used by application like OpenSea to pull get extra data
    for digital assets and easily display them.

    You can learn more about it here: https://docs.opensea.io/docs/part-3-adding-metadata-and-payments-to-your-contract

    But basically now when applications call the tokenURI() function, it will return the
    BASE_TOKEN_URI + tokenId.
    
    The code uses the Open Zeppelin framework.

    You can play with this tool to learn more:

    https://docs.openzeppelin.com/contracts/4.x/wizard
*/

// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract MetadataNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    string public constant BASE_TOKEN_URI =
        "https://opensea-creatures-api.herokuapp.com/api/creature/";

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MetadataNFT", "MetadataNFT") {}

    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return BASE_TOKEN_URI;
    }
}
