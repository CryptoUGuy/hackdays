// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Magic is ERC1155, Ownable {
    uint256 public constant MANA = 0;
    uint256 public constant GOLD = 1;
    uint256 public constant WAND = 2;
    uint256 public constant DRAGON_SCALES = 3;
    uint256 public constant SWORD = 4;
    uint256 public constant ENCHANTED_SWORD = 5;
    uint256 public constant LEGENDARY_SWORD = 6;
    bool internal madeLegendary = false;

    constructor() ERC1155("") {
        uint[] memory initialIds = new uint[](6);
        uint[] memory initialAmounts = new uint[](6);
        initialIds[0] = MANA;
        initialAmounts[0] = 10**6;
        initialIds[1] = GOLD;
        initialAmounts[1] = 10**10;
        initialIds[2] = WAND;
        initialAmounts[2] = 10000;
        initialIds[3] = DRAGON_SCALES;
        initialAmounts[3] = 500;
        initialIds[4] = SWORD;
        initialAmounts[4] = 10**6;
        initialIds[5] = ENCHANTED_SWORD;
        initialAmounts[5] = 6;

        _mintBatch(msg.sender, initialIds, initialAmounts, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }


    function enchantSword() public {

        uint256[] memory itemIds = new uint256[](3);
        itemIds[0] = MANA;
        itemIds[1] = WAND;
        itemIds[2] = SWORD;


        address[] memory addrs = new address[](itemIds.length);
        for (uint i = 0; i < itemIds.length; i++) {
            addrs[i] = msg.sender;
        }

        uint256[] memory inventory = balanceOfBatch(addrs, itemIds);
        require(inventory[0] >= 5000, "Not enough mana");
        require(inventory[1] > 0, "No wands");
        require(inventory[2] > 0, "No swords");


        uint256[] memory burnAmounts = new uint256[](itemIds.length);
        burnAmounts[0] = 5000;
        burnAmounts[1] = 0;
        burnAmounts[2] = 1;

        _burnBatch(msg.sender, itemIds, burnAmounts);
        _mint(msg.sender, ENCHANTED_SWORD, 1, "");
    }

    function attemptLegendary() public {
        uint256[] memory itemIds = new uint256[](4);
        itemIds[0] = MANA;
        itemIds[1] = WAND;
        itemIds[2] = ENCHANTED_SWORD;
        itemIds[3] = DRAGON_SCALES;


        address[] memory addrs = new address[](itemIds.length);
        for (uint i = 0; i < itemIds.length; i++) {
            addrs[i] = msg.sender;
        }

        uint256[] memory inventory = balanceOfBatch(addrs, itemIds);
        require(inventory[0] >= 50000, "Not enough mana");
        require(inventory[1] > 0, "No wands");
        require(inventory[2] > 2, "Need at least 3 enchanted swords");
        require(inventory[3] > 2, "Need dragon scales");

        uint256[] memory burnAmounts = new uint256[](itemIds.length);
        burnAmounts[0] = 50000;
        burnAmounts[1] = 1;
        burnAmounts[2] = 3;
        burnAmounts[3] = 3;
        _burnBatch(msg.sender, itemIds, burnAmounts);

        if (!madeLegendary) {
            madeLegendary = true;
            _mint(msg.sender, LEGENDARY_SWORD, 1, "");
        }

        // The spell fails and everything is lost.
    }

}