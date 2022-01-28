import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { SimpleERC1155, SimpleERC1155__factory } from '../../typechain'
import { parseUnits } from "ethers/lib/utils";

describe("SimpleERC1155 tests", () => {
    let instance: SimpleERC1155
    let accounts: Signer[]
    let adminAddress: string
    let adminSigner: Signer

    const GOLD_BALANCE = "1"
    const SILVER_BALANCE = "2"
    const SWORD_BALANCE = "3"

    before(async () => {
        accounts = await ethers.getSigners();

        adminSigner = accounts[0]
        adminAddress = await adminSigner.getAddress()
        const factory = new SimpleERC1155__factory(adminSigner)
        instance = await factory.deploy();
    })

    it("balanceOf", async () => {
        const goldBalance = await instance.balanceOf(adminAddress, TokenType.GOLD)

        const expectedGoldBalance = parseUnits(GOLD_BALANCE)

        expect(goldBalance).to.equal(expectedGoldBalance)

        const silverBalance = await instance.balanceOf(adminAddress, TokenType.SILVER)

        const expectedSilverBalance = parseUnits(SILVER_BALANCE)

        expect(silverBalance).to.equal(expectedSilverBalance)
    });

    it("balanceOfBatch", async () => {
        const balances = await instance.balanceOfBatch([adminAddress, adminAddress, adminAddress], [0, 1, 3])

        console.log("Balances", balances)

        const expectedGoldBalance = parseUnits(GOLD_BALANCE)
        const expectedSilverBalance = parseUnits(SILVER_BALANCE)
        const expectedSwordBalance = parseUnits(SWORD_BALANCE)

        expect(balances[0]).to.equal(expectedGoldBalance)
        expect(balances[1]).to.equal(expectedSilverBalance)
        expect(balances[2]).to.equal(expectedSwordBalance)
    });
});


enum TokenType {
    GOLD = 0,
    SILVER = 1,
    THORS_HAMMER = 2,
    SWORD = 3,
    SHIELD = 4
}