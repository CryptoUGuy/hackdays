import { expect } from "chai";
import { Signer } from "ethers";
import { deployments, ethers } from "hardhat";

import {SimpleNFT, SimpleNFT__factory } from '../../typechain'
import {ETHEREUM_ADDRESS_LENGTH } from "../../constants"

describe("SimpleNFT tests", () => {
  let instance: SimpleNFT 
  let accounts: Signer[]
  
  it("deploys correctly", async () => {
    accounts = await ethers.getSigners();
    const factory = new SimpleNFT__factory(accounts[0])

    instance = await factory.deploy();

    const name = await instance.name()
    const symbol = await instance.symbol()

    expect(instance.address).to.have.length(ETHEREUM_ADDRESS_LENGTH)

    expect(name).to.equals("SimpleNFT")
    expect(symbol).to.equals("SimpleNFT")
  });
});
