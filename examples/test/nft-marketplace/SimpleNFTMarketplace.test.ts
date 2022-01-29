import { BigNumber, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { SimpleNFTMarketplace, SimpleNFTMarketplace__factory, EnumerableNFT, EnumerableNFT__factory } from '../../typechain'

describe("SimpleNFTMarketplace tests", () => {
    let instance: SimpleNFTMarketplace
    let accounts: Signer[]
    let buyerSigner: Signer
    let sellerSigner: Signer
    let nftAddress: string
    let nftInstance: EnumerableNFT

    const NFT_IDENTIFIER: BigNumber = BigNumber.from(0) // since we only have 1
    const MARKET_ITEM_ID = 1

    before(async () => {
        accounts = await ethers.getSigners();
        const factory = new SimpleNFTMarketplace__factory(accounts[0])

        instance = await factory.deploy();

        sellerSigner = accounts[0]
        buyerSigner = accounts[1]

        // create an NFT 
        const enumerableNFTFactory = new EnumerableNFT__factory(sellerSigner)
        nftInstance = await enumerableNFTFactory.deploy("SampleNFT", "SNFT")
        nftAddress = nftInstance.address

        const buyerAddress = await buyerSigner.getAddress()
        const sellerAddress = await sellerSigner.getAddress()

        await nftInstance.safeMint(sellerAddress)
    })

    it("publish and buy an item in the marketplace", async () => {
        // approve before publishing since it involves a tranferFrom
        await nftInstance.approve(instance.address, NFT_IDENTIFIER)

        const price = parseUnits('0.01')

        // publish it to sell it
        const marketItemId = await instance.publishItem(
            nftAddress,
            NFT_IDENTIFIER,
            price,
            {
                value: parseUnits('0.01')
            }
        )
        await marketItemId.wait()

        // get item
        const item = await instance.getMarketItem(MARKET_ITEM_ID)
        console.log("MarketItemId", item)

        // get all items on sale
        const allItemsOnSale = await instance.getAllMarketItems()
        console.log("allItemsOnSale", allItemsOnSale)

        // someone buys the item
        const buyerInstance = instance.connect(buyerSigner)

        await buyerInstance.buyItem(nftAddress, MARKET_ITEM_ID, {
            value: price
        })
    });
});
