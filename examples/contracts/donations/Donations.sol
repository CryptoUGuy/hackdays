// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
    @dev A simple contract that receives donations and send to a beneficiary once
    the target amount has been reached.
 */
contract Donations is Ownable {
    mapping(address => uint256) private balances; // track donator balances

    uint256 public targetDonationsAmount;
    uint256 public totalDonationsAmount;
    address public beneficiary;
    uint256 public donationPeriodDeadline;
    bool public hasReachedTargedAmount;
    string public description;

    event DonorDeposited(address indexed userAddress, uint256 amount);

    constructor(
        uint256 _targetAmount,
        address _beneficiary,
        uint256 _donationPeriodTimestamp,
        string memory _description
    ) {
        targetDonationsAmount = _targetAmount;
        beneficiary = _beneficiary;
        totalDonationsAmount = 0;
        donationPeriodDeadline = block.timestamp + _donationPeriodTimestamp;
        description = _description;
    }

    function donate() external payable {
        require(
            block.timestamp < donationPeriodDeadline,
            "Period to donate over"
        );
        require(msg.sender != beneficiary, "Beneficiary cannot be a donor");
        require(msg.sender != owner(), "Owner cannot be a donor");
        require(hasReachedTargedAmount == false, "Target amount reached");

        balances[msg.sender] = balances[msg.sender] + msg.value;
        totalDonationsAmount = totalDonationsAmount + msg.value;

        if (totalDonationsAmount >= targetDonationsAmount) {
            hasReachedTargedAmount = true;
        }

        emit DonorDeposited(msg.sender, msg.value);
    }

    function withdrawDonations() external onlyBeneficiary {
        require(hasReachedTargedAmount, "Target hasn't been reached");
        selfdestruct(payable(beneficiary));
    }

    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary, "Invalid beneficiary");
        _;
    }

    receive() external payable {
        revert("not supported operation"); // the contract should only receive ether via the donate function
    }
}
