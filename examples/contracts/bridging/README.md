# Bridging Example

We have 2 contracts:

- L1Contract

- L2Contract

The idea is to send data from the L1Contract to the L2Contract.

In order to verify, we just check that the ```dataReceived``` variable has the value we are sending from L1.

### Environment setup

This example requires to run a local Optimism environment.

You can find the original text [here](https://community.optimism.io/docs/developers/build/dev-node/).

```shell
$ git clone https://github.com/ethereum-optimism/optimism.git

$ cd optimism

$ cd ops

$ docker-compose -f docker-compose-nobuild.yml up -t 600 --no-start

Once build finishes

$ docker-compose -f docker-compose-nobuild.yml up

Run in another terminal to check if everything is ready

$ scripts/wait-for-sequencer.sh && echo "System is ready to accept transactions"
```

Once the script shows ```System is ready to accept transactions```, you can run

```shell
    npm run bridging:sample
```

### Notes

The previous commands will create 2 instances:

- L1 (Ethereum) node: http://localhost:9545

- L2 (Optimism) node: http://localhost:8545

The Mnemonic used is:

```test test test test test test test test test test test junk```

L1 addresses can be get by running

```shell
curl http://localhost:8080/addresses.json
```

### References

- [Bridging basics](https://community.optimism.io/docs/developers/bridge/basics/)

- [Sending data between L1 and L2](https://community.optimism.io/docs/developers/bridge/messaging/)

- [Tutorials](https://community.optimism.io/docs/developers/tutorials/#)