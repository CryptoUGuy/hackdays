import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { MintableNFTAutoIncrement, MintableNFTAutoIncrement__factory } from '../../typechain'

describe("MintableNFTAutoIncrement tests", () => {
  let instance: MintableNFTAutoIncrement
  let accounts: Signer[]
  let user1Address: string;
  let user2Address: string;
  let user1Signer: Signer
  let user2Signer: Signer

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    user1Address = await accounts[0].getAddress()
    user2Address = await accounts[1].getAddress()

    user1Signer = accounts[0]
    user2Signer = accounts[1]

    const factory = new MintableNFTAutoIncrement__factory(user1Signer)

    instance = await factory.deploy();
  })

  it("mints", async () => {
    await instance.safeMint(user1Address)

    const userBalance = await instance.balanceOf(user1Address)
    const expectedUserBalance = 1

    expect(userBalance.toNumber()).to.equal(expectedUserBalance)

    // let's mint again
    await instance.safeMint(user1Address)

    const userBalanceAfterSecondMint = await instance.balanceOf(user1Address)
    const expectedUserBalanceAfterSecondMint = 2

    expect(userBalanceAfterSecondMint.toNumber()).to.equal(expectedUserBalanceAfterSecondMint)
  });
});
