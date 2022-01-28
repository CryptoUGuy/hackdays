import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { EnumerableNFT, EnumerableNFT__factory } from '../../typechain'

describe("EnumerableNFT tests", () => {
  let instance: EnumerableNFT
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

    const factory = new EnumerableNFT__factory(user1Signer)

    instance = await factory.deploy();
  })

  it("get enumerable information", async () => {
    const expectedTotalSupply = 2;
    const firstIndex = 0

    await instance.safeMint(user1Address)

    // let's mint again
    await instance.safeMint(user2Address)

    const totalSupply = await instance.totalSupply()

    // The token identifier for the `_index`th NFT
    const tokenByIndexItem = await instance.tokenByIndex(firstIndex)

    // The token identifier for the `_index`th NFT assigned to `_owner`
    const tokenOfOwnerByIndex = await instance.tokenOfOwnerByIndex(user1Address, firstIndex)

    console.log("Total supply", totalSupply.toNumber())
    console.log("Token By Index", tokenByIndexItem)
    console.log("Token Of Owner By Index", tokenOfOwnerByIndex)

    expect(totalSupply.toNumber()).to.equal(expectedTotalSupply)
  });
});
