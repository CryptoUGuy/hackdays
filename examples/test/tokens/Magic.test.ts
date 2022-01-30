import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { Magic, Magic__factory } from "../../typechain";

describe("Magic", function () {
  let magicInstance: Magic;
  let owner: Signer;
  let addr1: Signer;

  it("should deploy", async () => {
    [owner, addr1] = await ethers.getSigners();
    const magicFactory = new Magic__factory(owner)
    const magicDeployment = await magicFactory.deploy()
    magicInstance = Magic__factory.connect(magicDeployment.address, owner);
  });


  it("creates an enchanted sword", async () => {
    await magicInstance.safeBatchTransferFrom(
      await owner.getAddress(),
      await addr1.getAddress(),
      [
        await magicInstance.MANA(),
        await magicInstance.SWORD(),
        await magicInstance.WAND(),
      ],
      [
        5000,
        1,
        1
      ],
      [1,2] // the data parameter gets emitted as an event
    )

    const addr1Magic = Magic__factory.connect(magicInstance.address, addr1)

    await addr1Magic.enchantSword();

    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.ENCHANTED_SWORD())).is.equal(1);
    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.MANA())).is.equal(0);
    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.SWORD())).is.equal(0);
    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.WAND())).is.equal(1);
  });

  it("creates a legendary sword", async () => {

    await magicInstance.safeBatchTransferFrom(
      await owner.getAddress(),
      await addr1.getAddress(),
      [
        await magicInstance.MANA(),
        await magicInstance.DRAGON_SCALES(),
        await magicInstance.ENCHANTED_SWORD()
      ],
      [
        50000,
        3,
        2
      ],
      [1, 2] // the data parameter gets emitted as an event
    );
    const addr1Magic = magicInstance.connect(addr1);
    await addr1Magic.attemptLegendary();

    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.LEGENDARY_SWORD())).is.equal(1);

    // all reagents burned
    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.ENCHANTED_SWORD())).is.equal(0);
    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.DRAGON_SCALES())).is.equal(0);
    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.WAND())).is.equal(0);
    expect(await addr1Magic.balanceOf(await addr1.getAddress(), await addr1Magic.MANA())).is.equal(0);

  });

  it("only one legendary sword can be made", async () => {
    await magicInstance.attemptLegendary();

    // don't get the sword
    expect(await magicInstance.balanceOf(await owner.getAddress(), await magicInstance.LEGENDARY_SWORD())).to.equal(0);

    // lose all reagents
    expect(await magicInstance.balanceOf(await owner.getAddress(), await magicInstance.ENCHANTED_SWORD())).to.equal(1);
    expect(await magicInstance.balanceOf(await owner.getAddress(), await magicInstance.WAND())).to.equal(9998);
    expect(await magicInstance.balanceOf(await owner.getAddress(), await magicInstance.DRAGON_SCALES())).to.equal(494);
  });

});
