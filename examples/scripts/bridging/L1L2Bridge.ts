/**
 * Examples based on https://github.com/ethereum-optimism/optimism-tutorial/blob/main/l1-l2-deposit-withdrawal/scripts/example.js 
 */
import * as dotenv from "dotenv";

dotenv.config();

import { ethers } from "ethers"
import { predeploys, getContractInterface } from '@eth-optimism/contracts'
import { Watcher } from '@eth-optimism/core-utils'

import { L1Contract__factory, L2Contract__factory } from '../../typechain'

async function main() {
    // Set up our RPC provider connections.
    const L1_ENDPOINT = 'http://localhost:9545'
    const L2_ENDPOINT = 'http://localhost:8545'

    const l1RpcProvider = new ethers.providers.JsonRpcProvider(L1_ENDPOINT)
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(L2_ENDPOINT)

    // Set up our wallets (using a default mnemonic with 10k ETH allocated to it).
    // Need two wallets objects, one for interacting with L1 and one for interacting with L2.
    // Both will use the mnemonic.
    const BRIDGING_MNEMONIC = "test test test test test test test test test test test junk";
    const l1Wallet = ethers.Wallet.fromMnemonic(BRIDGING_MNEMONIC).connect(l1RpcProvider)
    const l2Wallet = ethers.Wallet.fromMnemonic(BRIDGING_MNEMONIC).connect(l2RpcProvider)

    const l2Messenger = new ethers.Contract(
        predeploys.L2CrossDomainMessenger,
        getContractInterface('L2CrossDomainMessenger'),
        l2RpcProvider
    )

    const l1Messenger = new ethers.Contract(
        await l2Messenger.l1CrossDomainMessenger(),
        getContractInterface('L1CrossDomainMessenger'),
        l1RpcProvider
    )

    const l1MessengerAddress = l1Messenger.address
    console.log("l1MessengerAddress", l1MessengerAddress)

    // L2 messenger address is always the same, 0x42.....07
    const l2MessengerAddress = l2Messenger.address
    console.log("l2MessengerAddress", l2MessengerAddress)

    // Tool that helps watches and waits for messages to be relayed between L1 and L2.
    const watcher = new Watcher({
        l1: {
            provider: l1RpcProvider,
            messengerAddress: l1MessengerAddress
        },
        l2: {
            provider: l2RpcProvider,
            messengerAddress: l2MessengerAddress
        }
    })

    // deploy L1 contract
    const l1Factory = new L1Contract__factory(l1Wallet)
    const l1Instance = await l1Factory.deploy(l1MessengerAddress)

    // deploy L2 contract
    const l2Factory = new L2Contract__factory(l2Wallet)
    const l2Instance = await l2Factory.deploy()
    console.log("Contracts have been deployed")

    const valueOnL2Before = await l2Instance.dataReceived()
    console.log("Value on L2 Before", valueOnL2Before.toNumber())

    const valueToSendToL2 = 100;
    const tx = await l1Instance.doTheThing(l2Instance.address, valueToSendToL2);
    console.log(`Value sent to L2 ${valueToSendToL2}`)

    await tx.wait()

    // Wait for the message to be relayed to L2.
    console.log('Waiting for message to be relayed to L2...')
    const [msgHash1] = await watcher.getMessageHashesFromL1Tx(tx.hash)

    await watcher.getL2TransactionReceipt(msgHash1, true)

    const valueOnL2After = await l2Instance.dataReceived()
    console.log("Value on L2 After", valueOnL2After.toNumber())
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })