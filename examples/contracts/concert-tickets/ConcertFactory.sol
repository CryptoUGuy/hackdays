// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./ConcertNFTicket.sol";
import "./ConcertMarketplace.sol";

contract ConcertFactory {
    struct Concert {
        string name;
        string symbol;
        uint256 ticketPrice;
        uint256 totalSupply;
        address marketplace;
    }

    address[] private allConcerts;

    mapping(address => Concert) public getConcert;

    event ConcertCreated(address nftAddress, address marketplaceAddress);

    function createConcert(
        string memory _concertName,
        string memory _concertSymbol,
        uint256 _ticketPrice,
        uint256 _totalSupply,
        address _cusdcAddress,
        address _organizer
    ) external returns (address) {
        ConcertMarketplace newMarketplace = new ConcertMarketplace();

        ConcertNFTicket newConcertNFT = new ConcertNFTicket(
            _concertName,
            _concertSymbol,
            _ticketPrice,
            _totalSupply,
            msg.sender, // organizer
            address(newMarketplace) // minter
        );

        newMarketplace.setAddresses(_cusdcAddress, newConcertNFT, _organizer);

        address newConcertNFTAddress = address(newConcertNFT);

        allConcerts.push(newConcertNFTAddress);

        getConcert[newConcertNFTAddress] = Concert({
            name: _concertName,
            symbol: _concertSymbol,
            ticketPrice: _ticketPrice,
            totalSupply: _totalSupply,
            marketplace: address(newMarketplace)
        });

        emit ConcertCreated(newConcertNFTAddress, address(newMarketplace));

        return newConcertNFTAddress;
    }

    function getAllConcerts() external view returns (address[] memory) {
        return allConcerts;
    }
}
