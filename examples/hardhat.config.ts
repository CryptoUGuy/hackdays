import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";

import 'hardhat-deploy';
import "@nomiclabs/hardhat-ethers"

dotenv.config();

const MAINNET_NETWORK_ID = 1
const TEST_NETWORK_ID = 1337

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  namedAccounts: {
    deployer: 0
  },
  networks: {
    hardhat: {
      chainId: process.env.ENABLE_FORKING ? MAINNET_NETWORK_ID : TEST_NETWORK_ID,
      forking: process.env.ENABLE_FORKING ? {
        url: process.env.FORKING_URL || ""
      } : undefined
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || ""
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
