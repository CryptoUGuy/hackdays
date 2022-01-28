// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
    Simple smart contract that allows you to create NFT collections.

    You create the collection and add items (NFTs) to the collection.

    Then you can query all metadata of a certain collection via 1 call.
 */
contract NFTAlbum {
    using Counters for Counters.Counter;

    Counters.Counter private collectionIds;

    struct Item {
        address nftContract;
        uint256 tokenId;
    }

    struct Collection {
        string name;
        Item[] items;
    }

    uint256 public constant COLLECTION_SIZE = 100;

    address public owner;

    mapping(uint256 => Collection) public collections;
    mapping(bytes32 => bool) public collectionExists;
    mapping(bytes32 => uint256) public collectionIdbyName;

    event CollectionCreated(uint256 indexed collectionId, string name);

    event ItemAdded(
        uint256 indexed collectionId,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    constructor() {
        collectionIds.increment();
        owner = msg.sender;
    }

    // function createCollection(string memory _collectionName)
    //     external
    //     onlyOwner
    // {
    //     bytes32 nameHash = keccak256(abi.encodePacked(_collectionName));
    //     require(
    //         collectionExists[nameHash] == false,
    //         "Collection already exists"
    //     );

    //     uint256 collectionId = collectionIds.current();
    //     collectionExists[nameHash] == true;

    //     collections[collectionId] = Collection(
    //         _collectionName,
    //         new Item[](COLLECTION_SIZE)
    //     );

    //     collectionIdbyName[nameHash] = collectionId;

    //     collectionIds.increment();

    //     emit CollectionCreated(collectionId, _collectionName);
    // }

    // function addItemToCollection(
    //     uint256 _collectionId,
    //     address _nftContractAddress,
    //     uint256 _tokenId
    // ) external onlyOwner {
    //     // validate the collection Id exists...
    //     Item memory newItem = Item(_nftContractAddress, _tokenId);
    //     collections[_collectionId].items.push(newItem);
    // }

    // function getCollectionByName(string memory _collectionName)
    //     external
    //     view
    //     returns (Item[] memory items)
    // {
    //     bytes32 nameHash = keccak256(abi.encodePacked(_collectionName));
    //     if (collectionExists[nameHash]) {
    //         uint256 collectionId = collectionIdbyName[nameHash];
    //         items = collections[collectionId].items;
    //         return items;
    //     }
    // }

    // function getCollectionById(uint256 _collectionId)
    //     external
    //     view
    //     returns (Item[] memory)
    // {
    //     return collections[_collectionId].items;
    // }

    modifier onlyOwner() {
        require(msg.sender == owner, "Invalid owner");
        _;
    }
}
