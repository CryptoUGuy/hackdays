/**
    This contract implements a simple lottery that uses a commit-reveal technique. 

    Randomness in Ethereum is a complex topic I suggest to read  https://fravoll.github.io/solidity-patterns/randomness.html.

    Another approach that can be used is an external Oracle like Chainlink.

    The following readings have more information: 

    - https://docs.chain.link/docs/chainlink-vrf/

    - https://docs.chain.link/docs/get-a-random-number/

    There is also a boilerplate that has all the elements to work with Chainlink and Hardhat locally:

    - https://github.com/smartcontractkit/hardhat-starter-kit

    Case Studies

    - https://chain.link/case-studies/aavegotchi   
*/

// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

contract SimpleLottery {
    uint256 public constant TICKET_PRICE = 0.01 ether;
    uint256 public ticketingDeadline;
    uint256 public revealingDeadline;

    address[] public tickets;
    address public winner;
    bytes32 private seed;

    mapping(address => bytes32) public commitments;

    constructor(uint256 _ticketingDuration, uint256 _revealDuration) {
        ticketingDeadline = block.timestamp + _ticketingDuration;
        revealingDeadline = ticketingDeadline + _revealDuration;
    }

    function buyTicket(bytes32 _commitment) external payable {
        require(msg.value >= TICKET_PRICE, "Not enough funds");
        require(
            block.timestamp < ticketingDeadline,
            "Buying tickets not possible"
        );

        commitments[msg.sender] = _commitment;
    }

    function createCommitment(address _player, uint256 _randomNumber)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(_player, _randomNumber));
    }

    function reveal(uint256 _randomNumber) external {
        require(
            block.timestamp >= ticketingDeadline,
            "Ticketing still running"
        );
        require(block.timestamp < revealingDeadline, "Invalid reveal perior");

        bytes32 hash = createCommitment(msg.sender, _randomNumber);
        require(hash == commitments[msg.sender], "Invalid commitment");

        seed = keccak256(abi.encode(seed, _randomNumber));
        tickets.push(msg.sender);
    }

    function pickWinner() public {
        require(
            block.timestamp > revealingDeadline + 5 minutes,
            "Cannot pick winner yet..."
        );
        require(winner == address(0), "Winner has been selected");

        winner = tickets[uint256(seed) % tickets.length];
    }

    function claimPrize() public {
        require(msg.sender == winner, "Invalid winner");
        payable(msg.sender).transfer(address(this).balance);
    }
}
