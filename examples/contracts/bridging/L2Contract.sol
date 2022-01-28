// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

contract L2Contract {
    uint256 public dataReceived;

    function doSomething(uint256 _myFunctionParam) public {
        dataReceived = _myFunctionParam;
    }
}
