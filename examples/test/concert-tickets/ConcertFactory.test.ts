import { expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { ConcertFactory, ConcertFactory__factory, CUSDC, CUSDC__factory, ConcertNFTicket__factory, ConcertMarketplace__factory } from '../../typechain'

describe("ConcertFactory tests", () => {
    let instance: ConcertFactory
    let cusdcInstance: CUSDC
    let accounts: Signer[]
    let adminAddress: string;
    let sellerAddress: string;
    let buyerAddress: string;

    let adminSigner: Signer
    let sellerSigner: Signer
    let buyerSigner: Signer

    const NUMBER_OF_TICKETS = 100;
    const TICKET_PRICE = 100; // 100 cUSDC 

    beforeEach(async () => {
        accounts = await ethers.getSigners();

        adminSigner = accounts[0]
        sellerSigner = accounts[1]
        buyerSigner = accounts[2]

        adminAddress = await adminSigner.getAddress()
        sellerAddress = await sellerSigner.getAddress()
        buyerAddress = await buyerSigner.getAddress()

        // pre requisites, deploy cUSDC
        const cUSDCFactory = new CUSDC__factory(buyerSigner)
        cusdcInstance = await cUSDCFactory.deploy()

        const factory = new ConcertFactory__factory(adminSigner)
        instance = await factory.deploy();
    })

    it("creates a concert, then a user buys ticket", async () => {
        // create concert
        const tx = await instance.createConcert(
            "U2 Concert",
            "U2C",
            parseUnits(`${NUMBER_OF_TICKETS}`),
            parseUnits(`${TICKET_PRICE}`),
            cusdcInstance.address,
            sellerAddress // organizer
        )
        await tx.wait()

        // get concert
        const firstConcertNFTAddress = (await instance.getAllConcerts())[0]
        const concertInfo = await instance.getConcert(firstConcertNFTAddress)
        console.log("Concert Info", concertInfo);

        // basic assertion
        expect(concertInfo.name).to.equal("U2 Concert")

        // get information directly from the NFT
        const concertNFTInstance = ConcertNFTicket__factory.connect(firstConcertNFTAddress, adminSigner);
        const totalTickets = await concertNFTInstance.getTotalTickets()
        const ticketPrice = await concertNFTInstance.getTicketPrice()

        console.log("Total supply from NFT", formatUnits(totalTickets.toString()))
        console.log("Ticket price from NFT", formatUnits(ticketPrice.toString()))

        // before buying, verify buyer balance
        expect(await concertNFTInstance.balanceOf(buyerAddress)).to.equal(0)

        // also cusdc balance of seller
        expect(await cusdcInstance.balanceOf(sellerAddress)).to.equal(0)

        // before buy approve cUSDC
        await cusdcInstance.approve(concertInfo.marketplace, ethers.constants.MaxInt256)

        // buy a ticket
        const concertMarketplaceInstance = ConcertMarketplace__factory.connect(concertInfo.marketplace, buyerSigner)
        await concertMarketplaceInstance.buyTicket();

        // asset that now the buyer has an NFT
        expect(await concertNFTInstance.balanceOf(buyerAddress)).to.equal(1)

        // and the seller has cusdc
        const expectedCUSDCBalance = BigNumber.from(parseUnits(`${TICKET_PRICE}`))
        const newUSDCSellerBalance = await cusdcInstance.balanceOf(sellerAddress)

        console.log("newUSDCSellerBalance", formatUnits(newUSDCSellerBalance.toString()))
        expect(formatUnits(newUSDCSellerBalance.toString())).to.equal(formatUnits(expectedCUSDCBalance))
    })
});
