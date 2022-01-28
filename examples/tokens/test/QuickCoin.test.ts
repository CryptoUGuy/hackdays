import { expect } from "chai";
import { Signer } from "ethers";
import { deployments, ethers } from "hardhat";

import { QuickCoin, QuickCoin__factory } from "../typechain";

describe("QuickCoin", function () {
  let quickCoinInstance: QuickCoin;
  let owner: Signer;
  let addr1: Signer;

  const initialMint = BigInt("19710000000000000000000000");

  it("should deploy", async () => {
    [owner, addr1] = await ethers.getSigners();

    const QuickCoinDeployment = await deployments.get("QuickCoin");

    quickCoinInstance = QuickCoin__factory.connect(
      QuickCoinDeployment.address,
      owner
    );
  });

  it("should mint tokens to the deployer", async () => {
    expect(
      await quickCoinInstance.balanceOf(await owner.getAddress())
    ).to.equal(initialMint);
  });

  it("should charge fees on send", async () => {
    const sentValue = BigInt(1000);
    const feeValue = BigInt(125);

    await quickCoinInstance.transfer(await addr1.getAddress(), sentValue);

    // receiver gets full transfer amount
    expect(
      await quickCoinInstance.balanceOf(await addr1.getAddress())
    ).to.equal(sentValue);

    // sender balance decreases by transfer amount + fee.
    expect(
      await quickCoinInstance.balanceOf(await owner.getAddress())
    ).to.equal(initialMint - sentValue - feeValue);

    // total supply should decrease by fee amount
    expect(await quickCoinInstance.totalSupply()).to.equal(
      initialMint - feeValue
    );
  });
});
