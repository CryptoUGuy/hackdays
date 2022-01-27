import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { MintableNFT, MintableNFT__factory } from '../../typechain'

describe("MintableNFT tests", () => {
  let instance: MintableNFT
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

    const factory = new MintableNFT__factory(user1Signer)

    instance = await factory.deploy();
  })

  it("mints", async () => {
    const tokenId = 1;

    await instance.safeMint(user1Address, tokenId)

    const userBalance = await instance.balanceOf(user1Address)
    const expectedUserBalance = 1

    expect(userBalance.toNumber()).to.equal(expectedUserBalance)
  });

  it("throws error: non owner", async () => {
    const tokenId = 2;

    // create an instance connected to a different user
    const newInstanceForNonOwnerUser = instance.connect(user2Signer)

    await expect(newInstanceForNonOwnerUser.safeMint(user2Address, tokenId))
      .to.be.revertedWith("Ownable: caller is not the owner")
  });

  it("throws error: same token id", async () => {
    const initialTokenId = 1;

    await instance.safeMint(user1Address, initialTokenId)

    const userBalance = await instance.balanceOf(user1Address)
    const expectedUserBalance = 1

    expect(userBalance.toNumber()).to.equal(expectedUserBalance)

    // retry using same id
    await expect(instance.safeMint(user2Address, initialTokenId))
      .to.be.revertedWith("ERC721: token already minted")
  });
});
