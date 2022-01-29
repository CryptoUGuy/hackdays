// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

/**
    @dev Simple concert ticket version

    We just define the rules in the smart contract (price, number of tickets, expiration).

    Notice how I'm using an expiration timestamp variable, you could use a status or any other variable that
    can be callable from the client to update the status.

 */
contract SimpleConcertTicket is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private ticketId;

    uint256 public constant TICKET_PRICE = 0.01 ether;

    uint256 public constant SALE_PERIOD = 1 days;

    uint256 public constant MAX_NUMBER_OF_TICKETS = 100;

    uint256 public expirationTimestamp;

    constructor() ERC721("SimpleConcertTicket", "SCT") {
        ticketId.increment();
        console.log("Current ticket id", ticketId.current());

        expirationTimestamp = block.timestamp + SALE_PERIOD;
    }

    function mint() public payable {
        require(
            block.timestamp < expirationTimestamp,
            "Tickets cannot be bought anymore"
        );
        require(msg.value == TICKET_PRICE, "Invalid amount");
        require(
            ticketId.current() <= MAX_NUMBER_OF_TICKETS,
            "Tickets sold out"
        );

        _safeMint(msg.sender, ticketId.current());

        ticketId.increment();
    }
}
