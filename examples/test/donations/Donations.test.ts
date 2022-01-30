import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";

import { Donations__factory, Donations } from '../../typechain'

describe("Donations tests", () => {
    let instance: Donations
    let accounts: Signer[]
    let ownerSigner: Signer
    let donor1Signer: Signer
    let donor2Signer: Signer
    let donor1Address: string
    let donor2Address: string
    let beneficiarySigner: Signer;
    let beneficiaryAddress: string

    // donation parameters
    const targetAmount = parseEther("10")
    const description = "Let's save the oceans";
    const donationPeriod = 60 * 60 * 24 // 1 day

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        ownerSigner = accounts[0]
        donor1Signer = accounts[1]
        donor2Signer = accounts[2]
        beneficiarySigner = accounts[3]

        const factory = new Donations__factory(ownerSigner);

        beneficiaryAddress = await beneficiarySigner.getAddress()

        donor1Address = await donor1Signer.getAddress()
        donor2Address = await donor2Signer.getAddress()

        instance = await factory.deploy(
            targetAmount,
            beneficiaryAddress,
            donationPeriod,
            description
        )
    })

    it("make donations and the beneficiary withdraws when target is reached", async () => {
        // balance before
        const contractBalanceBefore = await ethers.provider.getBalance(instance.address)
        console.log("contractBalanceBefore", formatUnits(contractBalanceBefore))

        // user 1 donate
        const amountUser1WillDonate = parseEther("5")
        const user1Instance = instance.connect(donor1Signer)
        const tx1 = user1Instance.donate({
            value: amountUser1WillDonate
        })

        await expect(tx1)
            .to.emit(user1Instance, "DonorDeposited")
            .withArgs(donor1Address, amountUser1WillDonate)

        // user 2 donate
        const amountUser2WillDonate = parseEther("5")
        const user2Instance = instance.connect(donor2Signer)
        const tx2 = user2Instance.donate({
            value: amountUser2WillDonate
        })

        await expect(tx2)
            .to.emit(user2Instance, "DonorDeposited")
            .withArgs(donor2Address, amountUser2WillDonate)

        // balance after
        const contractBalanceAfter = await ethers.provider.getBalance(instance.address)
        console.log("contractBalanceAfter", formatUnits(contractBalanceAfter))
        expect(contractBalanceAfter).to.equal(targetAmount)

        // check if we reach the target
        expect(await instance.hasReachedTargedAmount()).to.equal(true)

        // user 2 trying to donate again but should fail
        await expect(user2Instance.donate({
            value: amountUser2WillDonate
        })).to.be.revertedWith("Target amount reached")

        // beneficiary withdraws
        const initialBeneficiaryBalance = await ethers.provider.getBalance(beneficiaryAddress)
        console.log("initialBeneficiaryBalance", formatEther(initialBeneficiaryBalance))

        await instance.connect(beneficiarySigner).withdrawDonations()
        const contractBalanceAfterWithdrawal = await ethers.provider.getBalance(instance.address)
        expect(contractBalanceAfterWithdrawal).to.equal(0)

        const finalBeneficiaryBalance = await ethers.provider.getBalance(beneficiaryAddress)
        console.log("finalBeneficiaryBalance", formatEther(finalBeneficiaryBalance))
    });

    it("doesn't allow to deposit ether directly", async () => {
        await expect(donor1Signer.sendTransaction({
            to: instance.address,
            value: parseEther("1")
        })).to.be.revertedWith("not supported operation")
    })
});
// uint256 _targetAmount,
// address _beneficiary,
// uint256 _donationPeriodTimestamp,
// string memory _description
