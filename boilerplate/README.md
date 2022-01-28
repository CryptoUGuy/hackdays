# Hardhat boilerplate

This boilerplate contains all the plugins you require to develop, test, deploy and verify smart contracts using [Hardhat](https://hardhat.org/): a smart contract development framework.

The boilerplate comes with a sample contract, a test for that contract and a sample script that deploys the contract to an Ethereum test network: Ropsten.

## Pre requisites

- Install NVM (Node Version Manager) and use Node 16.13.1

```shell
# From NVM Guide (https://github.com/nvm-sh/nvm#installing-and-updating
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

nvm install 16.13.1
nvm use 16.13.1

```

- Install [Visual Studio Code](https://code.visualstudio.com/) (Recommended IDE)

- Install [Juan Blanco's Solidity Extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) for Visual studio code

- [Alchemy](https://www.alchemy.com/) account

- Sample mnemonic (Get a 12 words mnemonic from [https://iancoleman.io/bip39/](https://iancoleman.io/bip39/) or install Coinbase Wallet from the Corporate App Store.

- Get Ropsten Ether from a faucet:
    * [https://faucet.egorfine.com](https://faucet.egorfine.com/)
    * [https://www.moonborrow.com/](https://www.moonborrow.com/) 
    * [https://faucet.metamask.io/](https://faucet.metamask.io/)

- Get an Etherscan API Key (Check instructions [here](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics))

- Setup .env file (Check [.env setup section](#dotenv-setup))

## Get started

```shell
$ git clone https://github.com/CryptoUGuy/awesome-nft-resources.git

$ cd boilerplate

$ npm install
```

## Available commands

```shell
$ npm run compile # Compile smart contracts

$ npm run test # Run tests

$ npm run lint:check # Check typescript linting

$ npm run lint:fix # Fix typescript linting

$ npm run solhint:check # Check solidity linting

$ npm run solhint:fix # Fix solidity linting

$ npm run prettier:check # Check prettier rules

$ npm run prettier:fix # Fix prettier rules

$ npm run deploy:ropsten # Deploy contracts to Ropsten

$ npm run verify:ropsten # Verify contracts in Ropsten
```

## DotEnv setup

There is .env.sample file that contains 3 important variables that shoudn't be public:

- MNEMONIC
- ETHERSCAN_API_KEY
- ROPSTEN_URL

Create a new file called `.env`, paste the content of the .env.sample file and replace with your own values.

## Contract deployment

To deploy your contracts to an Ethereum test network you have to create a new file in the deploy folder for every new contract you are aiming to deploy.

Then run the command:

```shell
$ npm run deploy:ropsten
```

Note: Be sure the account you are using has enought funds.

## Etherscan verification

Assuming you have setup the .env file and you have previously deployed a smart contract.

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
$ npm run verify:ropsten DEPLOYED_CONTRACT_ADDRESS <Params>
```

Note: For complex arguments see [this](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#complex-arguments)

## Extra resources

[Understanding mnemonics](https://medium.com/mycrypto/the-journey-from-mnemonic-phrase-to-address-6c5e86e11e14)

[Chai assertions](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)

[Hardhat deploy](https://github.com/wighawag/hardhat-deploy#installation)

[Hardhat deploy sample](https://github.com/wighawag/template-ethereum-contracts)

[Hardhat deploy with forking](https://github.com/wighawag/template-ethereum-contracts/tree/examples/fork-test)
