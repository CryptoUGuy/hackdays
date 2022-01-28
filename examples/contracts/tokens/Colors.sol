// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Colors is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    enum ColorChannel {
        RED,
        GREEN,
        BLUE
    }

    constructor() ERC721("Colors", "COL") {
        _safeMint(msg.sender, 0); // black
    }

    function mintColorChannel(ColorChannel channel) public onlyOwner {
        require(
            channel == ColorChannel.RED ||
                channel == ColorChannel.GREEN ||
                channel == ColorChannel.BLUE,
            "Invalid color channel"
        );
        uint256 multiBy = 1;
        if (channel == ColorChannel.RED) {
            multiBy = 2**16;
        } else if (channel == ColorChannel.GREEN) {
            multiBy = 2**8;
        } else if (channel == ColorChannel.BLUE) {
            multiBy = 1;
        }
        for (uint256 i = 1; i < 256; i++) {
            _safeMint(msg.sender, i * multiBy);
        }
    }

    // Creates a new color by mixing the input colors.
    // Sender must own both colors, after mixing, the old colors are destroyed and a new one is minted.
    function mixColors(uint256 color1, uint256 color2) public {
        require(ownerOf(color1) == msg.sender, "Does not own color");
        require(ownerOf(color2) == msg.sender, "Does not own color");
        _safeMint(msg.sender, color1 | color2);
        burn(color1);
        burn(color2);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
