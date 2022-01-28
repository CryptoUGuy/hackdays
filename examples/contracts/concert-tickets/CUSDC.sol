// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
    @dev Mock USDC coin that will be used to purchase concert tickets. 
*/
contract CUSDC is ERC20 {
    constructor() ERC20("cUSDC", "cUSDC") {
        _mint(msg.sender, 10000 * 10**uint256(decimals()));
    }
}
