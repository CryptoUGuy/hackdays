# Token Examples

Ether/ETH is Ethereum's native currency. The rules that govern ETH's minting, transfer and overall accounting are writen directly into the Ethereum protocol. ETH is used by the protocol to pay gas fees to cover the cost of evaluating each transaction. 


Smart contracts can be used to create user defined tokens. These contracts must define their own minting, transfer and accounting rules. The community has created standard interfaces for different types of tokens [ERC20 - Fungible Token](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/), [ERC721 - Non Fungible Token](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/), and [ERC1155 - Multi-Token Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/). These standard interfaces allow wallets, smart contracts and dApps to query and transact generically with the value the tokens represent.


While using these interfaces is relatively easy, implementing them can be very tricky. Any non-academic effort implementation should be built on a trusted contract library like the ones provided by OpenZeppelin.

```shell
npm install @openzeppelin/contracts
```

OpenZepplin's [Token Creation Wizard](https://docs.openzeppelin.com/contracts/4.x/wizard) is a great bootstrap tool for all token types. It offers the opprotunity to mix in useful behaviors such as access controls, mint-ability, token-balance + delegated voting, and other functionality. Take the boilerplate material this tool generates and use it as a starting point for further customization.

## ERC-20

Smart contracts that implement the ERC-20 standard interface define a single fungible token. Fungible tokens are indistingushable from each other and can be thought of like currencies. The smart contract implementation acts as a ledger for its specific token, and controls all logic around creation, burning and transfers. 

See `contracts/QuickCoin.sol` and `test/QuickCoin.test.ts` for an example ERC-20 based on OpenZepplin's boilerplate that burns 0.125% of each transfer from the sender's balance.

Refer to OpenZeppelin's ERC20 [Documentation](https://docs.openzeppelin.com/contracts/4.x/erc20) and [API Reference](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20) for further discussion.


## ERC-721

Smart contracts that implement the ERC-721 standard interface represent a collection of non-fungible tokens. Each token is uniquely identifable and can be associated with different meta-data.


See `contracts/Colors.sol` and `test/Colors.test.ts` for an example ERC-721 based on the OpenZepplin's boilerplate that mints tokenIds representing RGB color values and allows for different tokens to be mixed to create new ones.

Refer to OpenZeppelin's ERC721 [Documentation](https://docs.openzeppelin.com/contracts/4.x/erc721) and [API Reference](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721) for further discussion.





