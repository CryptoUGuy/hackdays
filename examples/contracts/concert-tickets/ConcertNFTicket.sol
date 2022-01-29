// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ConcertNFTicket is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private ticketIds;

    address public organiser;
    address public minter;
    uint256 private ticketPrice;
    uint256 private totalSupply;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _ticketPrice,
        uint256 _totalSupply,
        address _organizer,
        address _minter
    ) ERC721(_name, _symbol) {
        require(_totalSupply > 0, "Invalid total supply");
        ticketPrice = _ticketPrice;
        totalSupply = _totalSupply;
        organiser = _organizer;
        minter = _minter;
    }

    function safeMint(address _to) public onlyMinter returns (uint256) {
        require(ticketIds.current() <= totalSupply, "No tickets available");
        ticketIds.increment();
        uint256 ticketId = ticketIds.current();
        _safeMint(_to, ticketId);
        return ticketId;
    }

    function getTicketPrice() external view returns (uint256) {
        return ticketPrice;
    }

    function getTotalTickets() external view returns (uint256) {
        return totalSupply;
    }

    function areTicketsAvailable() external view returns (bool) {
        return ticketIds.current() <= totalSupply;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Invalid minter");
        _;
    }
}
