/**
    This sample checks the balance of an Ethereum account in a mainnet deployed token using the forking capability of hardhat.

    Notice the environment variable defined in the package.json for the script task 'test:balanceReader'

    https://hardhat.org/hardhat-network/guides/mainnet-forking.html

    Be aware that you require a .env variable called FORKING_URL
 */

// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BalanceReader {
    function getERC20BalanceOf(address _account, address _tokenAddress)
        external
        view
        returns (uint256)
    {
        // we create an instance only using the interface and the address
        return IERC20(_tokenAddress).balanceOf(_account);
    }
}
