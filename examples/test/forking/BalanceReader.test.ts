import { Signer } from "ethers";
import { ethers } from "hardhat";
import { formatUnits, parseUnits } from "ethers/lib/utils";

import { BalanceReader, BalanceReader__factory } from '../../typechain'

const onlyIfForkingMode = process.env.ENABLE_FORKING ? it : it.skip

describe("BalanceReader tests", () => {
    let instance: BalanceReader
    let accounts: Signer[]

    const USDC_MAINNET_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" // https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
    const ALAMEDA_ADDRESS = "0x0F4ee9631f4be0a63756515141281A3E2B293Bbe"
    const USDC_DECIMALS = 6

    onlyIfForkingMode("gets Alameda balance", async () => {
        accounts = await ethers.getSigners();
        const factory = new BalanceReader__factory(accounts[0])

        instance = await factory.deploy()

        const balance = await instance.getERC20BalanceOf(ALAMEDA_ADDRESS, USDC_MAINNET_ADDRESS);
        const balanceAsString = formatUnits(balance, USDC_DECIMALS)

        console.log("The USDC Balance of Alameda is $", Number(balanceAsString).toLocaleString())
    });
});
