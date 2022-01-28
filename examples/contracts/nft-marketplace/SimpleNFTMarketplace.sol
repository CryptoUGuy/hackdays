/**
    Simple NFT Marketplace

    The contract includes a publishing fee and a simple way to publish and buy NFTs
 */

// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract SimpleNFTMarketplace {
    using Counters for Counters.Counter;

    Counters.Counter private _itemIdsOnSale;
    Counters.Counter private _itemIdsSold;

    uint256 public constant PUBLISHING_FEE = 0.01 ether;

    address public owner;

    enum Status {
        OnSale,
        Sold
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        Status status;
    }

    mapping(uint256 => MarketItem) public getMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        Status status
    );

    event MarketItemSold(
        uint256 indexed itemId,
        address lastOwner,
        address newOwner
    );

    constructor() {
        owner = msg.sender;
    }

    function publishItem(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) public payable {
        // validate
        require(msg.value == PUBLISHING_FEE, "You have to pay a fee");
        require(_price > 0, "Price must be greater than 0");

        // increment
        _itemIdsOnSale.increment();

        uint256 currentItemId = _itemIdsOnSale.current();

        // store item
        getMarketItem[currentItemId] = MarketItem(
            currentItemId,
            _nftContract,
            _tokenId,
            payable(msg.sender),
            payable(address(0)),
            _price,
            Status.OnSale
        );

        console.log("Token Id", _tokenId);

        // transfer
        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        // emit event
        emit MarketItemCreated(
            currentItemId,
            _nftContract,
            _tokenId,
            msg.sender,
            address(0),
            _price,
            Status.OnSale
        );
    }

    function buyItem(address _nftContract, uint256 _itemId) public payable {
        uint256 price = getMarketItem[_itemId].price;
        console.log("Price", price);

        uint256 tokenId = getMarketItem[_itemId].tokenId;
        Status status = getMarketItem[_itemId].status;

        require(msg.value == price, "Invalid price");
        require(status == Status.OnSale, "The item is not on sale");

        address oldOwner = getMarketItem[_itemId].seller;

        getMarketItem[_itemId].owner = payable(msg.sender);
        _itemIdsSold.increment();
        getMarketItem[_itemId].status = Status.Sold;

        // transfer money to seller
        getMarketItem[_itemId].seller.transfer(msg.value);

        // transfer nft
        IERC721(_nftContract).transferFrom(address(this), msg.sender, tokenId);

        emit MarketItemSold(_itemId, oldOwner, msg.sender);
    }

    function getAllMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIdsOnSale.current();
        uint256 unsoldItemCount = _itemIdsOnSale.current() -
            _itemIdsSold.current();

        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (getMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = getMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
