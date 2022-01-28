import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { MetadataNFT, MetadataNFT__factory } from '../../typechain'

describe("MetadataNFT tests", () => {
  let instance: MetadataNFT
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

    const factory = new MetadataNFT__factory(user1Signer)

    instance = await factory.deploy();
  })

  it("mints and get tokenURI for each tokenId", async () => {
    await instance.safeMint(user1Address)
    // let's mint again
    await instance.safeMint(user1Address)

    const expectedTokenId1 = 0
    const expectedTokenId2 = 1

    const baseUri = await instance.BASE_TOKEN_URI();

    const url1 = await instance.tokenURI(expectedTokenId1)

    const url2 = await instance.tokenURI(expectedTokenId2)

    expect(url1).to.be.equal(baseUri + expectedTokenId1)
    expect(url2).to.be.equal(baseUri + expectedTokenId2)
  });
});
