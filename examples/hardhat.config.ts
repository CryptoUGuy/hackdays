import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";

import 'hardhat-deploy';
import "@nomiclabs/hardhat-ethers"

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  namedAccounts: {
    deployer: 0
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || ""
      }
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
