// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./ConcertNFTicket.sol";

import "hardhat/console.sol";

contract ConcertMarketplace is Ownable {
    IERC20 public tokenCurrency;
    ConcertNFTicket public concertNFTicket;

    address public organizer;

    event TicketPurchased(
        address indexed buyer,
        address seller,
        uint256 ticketId
    );

    function setAddresses(
        address _currency,
        ConcertNFTicket _concertNFTicket,
        address _organizer
    ) external onlyOwner {
        tokenCurrency = IERC20(_currency);
        concertNFTicket = _concertNFTicket;
        organizer = _organizer;
    }

    function buyTicket() external {
        require(concertNFTicket.areTicketsAvailable(), "No tickets");

        uint256 ticketPrice = concertNFTicket.getTicketPrice();
        console.log("Ticket Price", ticketPrice);

        console.log("Organizer", organizer);
        tokenCurrency.transferFrom(msg.sender, organizer, ticketPrice);

        uint256 ticketId = concertNFTicket.safeMint(msg.sender);

        emit TicketPurchased(msg.sender, organizer, ticketId);
    }
}
