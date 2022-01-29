import { expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";

import { NFTAlbum, NFTAlbum__factory, EnumerableNFT, EnumerableNFT__factory } from '../../typechain'

describe("NFTAlbum tests", () => {
    let instance: NFTAlbum
    let accounts: Signer[]
    let ownerSigner: Signer
    let ownerAddress: string
    let firstNFT: EnumerableNFT
    let secondNFT: EnumerableNFT

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        ownerSigner = accounts[0]
        ownerAddress = await ownerSigner.getAddress()
        const factory = new NFTAlbum__factory(ownerSigner)
        instance = await factory.deploy();

        // create and mint sample NFTs
        const enumerableNFTFactory = new EnumerableNFT__factory(ownerSigner)

        firstNFT = await enumerableNFTFactory.deploy("1NFT", "1NFT");
        await firstNFT.safeMint(ownerAddress)

        secondNFT = await enumerableNFTFactory.deploy("2NFT", "2NFT");
        await secondNFT.safeMint(ownerAddress)
    })

    it('verify user balance', async () => {
        expect(await firstNFT.balanceOf(ownerAddress)).to.equal(1)
        expect(await secondNFT.balanceOf(ownerAddress)).to.equal(1)
    })

    const createCollection = async (name: string) => {
        const collectionId = (await instance.callStatic.createCollection(name)).toNumber()
        const tx = await instance.createCollection(name)
        tx.wait()
        return {
            collectionId,
            tx
        };
    }

    const addSampleNFTsToCollection = async (collectionId: number) => {
        const firstNFTokenId = await firstNFT.tokenOfOwnerByIndex(ownerAddress, 0)
        console.log("First NFT Token Id", firstNFTokenId)
        await instance.addItemToCollection(collectionId, firstNFT.address, firstNFTokenId)

        const secondNFTokenId = await secondNFT.tokenOfOwnerByIndex(ownerAddress, 0)
        console.log("Second NFT Token Id", secondNFTokenId)
        await instance.addItemToCollection(collectionId, secondNFT.address, secondNFTokenId)
    }

    it('create a collection and get all items', async () => {
        const collectionName = "Collection 1";
        const { collectionId, tx } = await createCollection(collectionName);
        expect(tx).to.emit(instance, 'CollectionCreated')

        await addSampleNFTsToCollection(collectionId);

        const itemsRetrievedById = await instance.getCollectionItemsById(collectionId)
        console.log("Items Retrieved By Id", itemsRetrievedById)

        const itemsRetrievedByName = await instance.getCollectionItemsByName(collectionName)
        console.log("Items Retrieved By Name", itemsRetrievedByName)

        expect(itemsRetrievedById).to.deep.equal(itemsRetrievedByName)
    })

    it('should getCollectionInfo and getAllCollections', async () => {
        const collection1Name = "Collection 1";
        const { collectionId: collectionId1 } = await createCollection(collection1Name);

        const collection2Name = "Collection 2";
        const { collectionId: collectionId2 } = await createCollection(collection2Name);

        const collections = await instance.getAllCollections();

        expect(collections).to.have.length(2)

        const collection1Info = await instance.getCollectionInfo(collectionId1)
        expect(collection1Info.name).to.equal(collection1Name)

        const collection2Info = await instance.getCollectionInfo(collectionId2)
        expect(collection2Info.name).to.equal(collection2Name)
    })

})