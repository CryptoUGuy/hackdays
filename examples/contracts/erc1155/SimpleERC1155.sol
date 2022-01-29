/**
    Simple ERC1155: 1 contract to represent multiple tokens at once.

    The code uses the Open Zeppelin framework.

    You can play with this tool to learn more:

    https://docs.openzeppelin.com/contracts/4.x/wizard

    https://docs.openzeppelin.com/contracts/4.x/erc1155

 */

// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract SimpleERC1155 is ERC1155 {
    // Token Ids
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, GOLD, 1 * 10**18, "");
        _mint(msg.sender, SILVER, 2 * 10**18, "");
        _mint(msg.sender, THORS_HAMMER, 1, ""); // non fungible token as we minted only one
        _mint(msg.sender, SWORD, 3 * 10**18, "");
        _mint(msg.sender, SHIELD, 4 * 10**18, "");
    }
}
