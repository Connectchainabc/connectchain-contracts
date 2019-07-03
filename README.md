Connectchain contracts
======================

## Develop

### Install truffle

```
npm install -g truffle
```

### Commands

```
// Compile
truffle compile

// Migrate
truffle migrate

// Test
truffle test
```

## Debug

1. install remixd

```
npm install -g remixd
remixd -s .  --remix-ide https://remix.ethereum.org
```

2. open remix on https://remix.ethereum.org and link to localhost.

3. compile and deploy on javascript VM

4. test with the deployed smart contract

## Flatten

```
truffle-flattener contracts/*.sol > flat.sol
```