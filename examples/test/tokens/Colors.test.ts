import { expect } from "chai";
import { Signer } from "ethers";
import { deployments, ethers } from "hardhat";

import { Colors, Colors__factory } from "../../typechain";

describe("Colors", function () {
  let colorsInstance: Colors;
  let owner: Signer;
  let addr1: Signer;

  it("should deploy", async () => {
    [owner, addr1] = await ethers.getSigners();
    const colorsFactory = new Colors__factory(owner)
    const ColorsDeployment = await colorsFactory.deploy()


    colorsInstance = Colors__factory.connect(ColorsDeployment.address, owner);

    await colorsInstance.mintColorChannel(0);
    await colorsInstance.mintColorChannel(1);
    await colorsInstance.mintColorChannel(2);
  });

  it("Should mint 766 colors to the deployer", async () => {
    expect(await colorsInstance.balanceOf(await owner.getAddress())).to.equal(
      766
    );
  });

  it("Should be able to send colors", async () => {
    await colorsInstance.transferFrom(
      await owner.getAddress(),
      await addr1.getAddress(),
      0xab0000
    );
    await colorsInstance.transferFrom(
      await owner.getAddress(),
      await addr1.getAddress(),
      0x0000ef
    );
  });

  it("Should mix new color and burn old ones", async () => {

    const addr1Conn = Colors__factory.connect(colorsInstance.address, addr1);

    await addr1Conn.mixColors(0xab0000, 0x0000ef);

    // new color exists
    expect(await addr1Conn.ownerOf(0xab00ef)).is.equal(
      await addr1.getAddress()
    );

    // old colors gone
    expect(await addr1Conn.balanceOf(await addr1.getAddress())).is.equal(1);
  });
});
