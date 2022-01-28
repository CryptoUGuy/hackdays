// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract QuickCoin is ERC20, ERC20Burnable {
    // Automatically reverts transactions when overflow is encountered
    using SafeMath for uint256;

    constructor() ERC20("QuickCoin", "QCK") {
        _mint(msg.sender, 19710000 * 10**decimals());
    }

    // QuickCoin enforces a 0.125% fee on every transfer from the source. The fee is burned.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (from == address(0) || to == address(0)) {
            // Do not apply burn logic on mint/burn operations :)
            super._beforeTokenTransfer(from, to, value);
            return;
        }

        uint256 burnValue = value.mul(125).div(1000);
        _burn(from, burnValue);

        // Always call thru to super after doing our logic.
        super._beforeTokenTransfer(from, to, value);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        console.log("After xfer '%s' to '%s' of '%s'", from, to, value);

        // Always call thru to super after doing our logic.
        super._afterTokenTransfer(from, to, value);
    }
}
