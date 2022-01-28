import { ethers } from "hardhat";

export const increaseTimeBy = (ms: number) => ethers.provider.send('evm_increaseTime', [ms])
