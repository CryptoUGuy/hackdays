import { expect } from "chai";
import { Signer } from "ethers";
import { deployments, ethers } from "hardhat";

import { Greeter, Greeter__factory } from "../typechain";

describe("Greeter", function () {
  let greeterInstance: Greeter;
  let accounts: Signer[];

  it("Should return the new greeting once it's changed", async () => {
    accounts = await ethers.getSigners();

    const GreeterDeployment = await deployments.get("Greeter");

    greeterInstance = Greeter__factory.connect(
      GreeterDeployment.address,
      accounts[0]
    );

    expect(await greeterInstance.greet()).to.equal("Hello, Hardhat!");

    const setGreetingTx = await greeterInstance.setMyGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeterInstance.greet()).to.equal("Hola, mundo!");
  });
});
