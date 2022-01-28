import { Signer } from "ethers";
import { ethers } from "hardhat";
import { parseUnits } from "ethers/lib/utils";

import { SimpleLottery, SimpleLottery__factory } from '../../typechain'
import { increaseTimeBy } from "../utils";

const ONE_DAY_IN_SECONDS = 60 * 60 * 24
const FIVE_MINUTES_IN_SECONDS = 60 * 5


describe("SimpleLottery tests", () => {
    let instance: SimpleLottery
    let accounts: Signer[]
    let participant1: Signer
    let participant2: Signer
    let participant3: Signer

    const ticketingDuration = ONE_DAY_IN_SECONDS
    const revealDuration = ONE_DAY_IN_SECONDS

    before(async () => {
        accounts = await ethers.getSigners();
        const factory = new SimpleLottery__factory(accounts[0])

        instance = await factory.deploy(ticketingDuration, revealDuration);

        participant1 = accounts[0]
        participant2 = accounts[1]
        participant3 = accounts[2]
    })

    it("allow participants to buy tickets and once revealing deadline pass, it picks a winner", async () => {

        // create commitment for user 1
        const PARTICIPANT1_GUESS = 1
        const participant1Address = await participant1.getAddress()
        const commitmentParticipant1 = await instance.createCommitment(participant1Address, PARTICIPANT1_GUESS)

        // buy ticket
        await instance.buyTicket(commitmentParticipant1, { value: parseUnits("0.01") })

        // create commitment for user 2
        const PARTICIPANT2_GUESS = 3
        const participant2Address = await participant2.getAddress()
        const commitmentParticipant2 = await instance.createCommitment(participant2Address, PARTICIPANT2_GUESS)

        // buy ticket
        await instance.connect(participant2).buyTicket(commitmentParticipant2, { value: parseUnits("0.01") })

        // create commitment for user 2
        const PARTICIPANT3_GUESS = 3
        const participant3Address = await participant3.getAddress()
        const commitmentParticipant3 = await instance.createCommitment(participant3Address, PARTICIPANT3_GUESS)

        // buy ticket
        await instance.connect(participant3).buyTicket(commitmentParticipant3, { value: parseUnits("0.01") })

        // advance time
        await increaseTimeBy(ticketingDuration + 1)

        // reveal
        await instance.reveal(PARTICIPANT1_GUESS)

        await instance.connect(participant2).reveal(PARTICIPANT2_GUESS)

        await instance.connect(participant3).reveal(PARTICIPANT3_GUESS)

        // advance time
        await increaseTimeBy(revealDuration + FIVE_MINUTES_IN_SECONDS)

        await instance.pickWinner()

        console.log("The winner is", await instance.winner())

        // Now you can claim the prize!
    });
});
