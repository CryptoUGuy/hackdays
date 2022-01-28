import { expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { SimpleConcertTicket, SimpleConcertTicket__factory } from '../../typechain'
import { increaseTimeBy } from "../utils";

describe("SimpleConcertTicket tests", () => {

    let instance: SimpleConcertTicket
    let accounts: Signer[]

    let adminSigner: Signer
    let buyerSigner: Signer

    let adminAddress: string;
    let buyerAddress: string;

    const PRICE = parseUnits('0.01')
    const FIVE_DAYS = 60 * 60 * 24 * 5 // in seconds

    beforeEach(async () => {
        accounts = await ethers.getSigners();

        adminSigner = accounts[0]
        buyerSigner = accounts[1]

        adminAddress = await adminSigner.getAddress()
        buyerAddress = await buyerSigner.getAddress()

        const factory = new SimpleConcertTicket__factory(buyerSigner)
        instance = await factory.deploy()
    })

    it('fails due to bad amount', async () => {
        await expect(instance.mint({ value: parseUnits("0.02") }))
            .to.revertedWith('Invalid amount')
    })

    it('buys a ticket', async () => {
        // check contract balance before buy
        const buyerBalanceBefore = await instance.balanceOf(buyerAddress)
        expect(buyerBalanceBefore).to.equal(0)

        // save user balance before buy
        const contractBalanceBefore = await ethers.provider.getBalance(instance.address)

        expect(contractBalanceBefore).to.equal(BigNumber.from(0))

        await instance.connect(buyerSigner).mint({
            value: PRICE
        })

        // check contract balance after buy
        const contractBalanceAfter = await ethers.provider.getBalance(instance.address)
        expect(contractBalanceAfter).to.equal(PRICE)

        // user balance after buy
        const buyerNFTBalanceAfter = await instance.balanceOf(buyerAddress)
        expect(buyerNFTBalanceAfter).to.equal(1)


    })

    it('prevents buying when deadline passed', async () => {
        await increaseTimeBy(FIVE_DAYS)

        await expect(instance.connect(buyerSigner).mint({
            value: PRICE
        })).to.be.revertedWith('Tickets cannot be bought anymore')
    })
})