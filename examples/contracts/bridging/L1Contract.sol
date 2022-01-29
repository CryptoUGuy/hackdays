// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import {L1CrossDomainMessenger} from "@eth-optimism/contracts/L1/messaging/L1CrossDomainMessenger.sol";

contract L1Contract {
    L1CrossDomainMessenger public ovmL1CrossDomainMessenger;

    constructor(address _ovmL1CrossDomainMessenger) {
        ovmL1CrossDomainMessenger = L1CrossDomainMessenger(
            _ovmL1CrossDomainMessenger
        );
    }

    function doTheThing(
        address myOptimisticContractAddress,
        uint256 myFunctionParam
    ) public {
        ovmL1CrossDomainMessenger.sendMessage(
            myOptimisticContractAddress,
            abi.encodeWithSignature("doSomething(uint256)", myFunctionParam),
            1000000 // use whatever gas limit you want
        );
    }
}
