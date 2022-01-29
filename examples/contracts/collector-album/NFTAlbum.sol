// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

/**
    @dev Simple smart contract that allows you to create NFT collections.

    You create the collection and add items (NFTs) to the collection.

    Then you can query all metadata of a certain collection via 1 call.

    Notes:

    -   1 NFTAlbum (Owned by a user) -> 1..N Collections
    -   1 Collection -> 1..N Items
 */
contract NFTAlbum {
    using Counters for Counters.Counter;

    Counters.Counter private collectionIds;

    address public owner;

    struct Item {
        address nftContract;
        uint256 tokenId;
    }

    struct Collection {
        string name;
        uint256 collectionId;
        uint256 creationTimestamp;
    }

    mapping(uint256 => Collection) private collections;
    mapping(uint256 => Item[]) private collectionItems; // collectionId => Item[]
    mapping(bytes32 => bool) private collectionByHashExists; // namehash => bool
    mapping(uint256 => bool) private collectionByIdExists; // collectionId => bool
    mapping(bytes32 => uint256) private collectionIdbyNamehash; // namehash => collectionId

    event CollectionCreated(uint256 collectionId, string name);

    event ItemAdded(
        uint256 indexed collectionId,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    constructor() {
        owner = msg.sender;
    }

    function createCollection(string memory _collectionName)
        external
        onlyOwner
        returns (uint256 newCollectionId)
    {
        bytes32 nameHash = keccak256(abi.encodePacked(_collectionName));

        require(
            collectionByHashExists[nameHash] == false,
            "Collection already exists"
        );

        collectionIds.increment();
        newCollectionId = collectionIds.current();

        collectionByIdExists[newCollectionId] = true;
        collectionByHashExists[nameHash] = true;
        collectionIdbyNamehash[nameHash] = newCollectionId;

        collections[newCollectionId] = Collection(
            _collectionName,
            newCollectionId,
            block.timestamp
        );

        emit CollectionCreated(newCollectionId, _collectionName);
    }

    function addItemToCollection(
        uint256 _collectionId,
        address _nftContractAddress,
        uint256 _tokenId
    ) external onlyOwner {
        require(
            collectionByIdExists[_collectionId],
            "Collection doesn't exists"
        );
        collectionItems[_collectionId].push(
            Item(_nftContractAddress, _tokenId)
        );
    }

    function getCollectionItemsById(uint256 _collectionId)
        public
        view
        returns (Item[] memory)
    {
        return collectionItems[_collectionId];
    }

    function getCollectionItemsByName(string memory _collectionName)
        external
        view
        returns (Item[] memory)
    {
        bytes32 nameHash = keccak256(abi.encodePacked(_collectionName));
        uint256 collectionId = collectionIdbyNamehash[nameHash];
        return getCollectionItemsById(collectionId);
    }

    function getCollectionInfo(uint256 _collectionId)
        external
        view
        returns (Collection memory)
    {
        return collections[_collectionId];
    }

    function getAllCollections()
        external
        view
        returns (Collection[] memory result)
    {
        result = new Collection[](collectionIds.current());
        for (uint256 i = 0; i < collectionIds.current(); i++) {
            result[i] = collections[i + 1];
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Invalid owner");
        _;
    }
}
