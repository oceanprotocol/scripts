# scripts
A simple script, that fetches NFT list from sugbraph and then searches for coresponding DID in two separate Aquarius instances

## 🏗 Installation & Usage

### Set up environment variables

- Set a private key(by exporting env "PRIVATE_KEY")

```
export PRIVATE_KEY"XXXX"
```

- Set an RPC

```
export RPC="https://sapphire.oasis.io"
```

- Set subgraph

```
export SUBGRAPH_URL='http://v4.subgraph.sapphire-testnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph'
```


### Build the TypeScript code

```
npm run build
```

### Use

List available commands

```
npm run cli h
```

E.g. claim all FixedRateExchange fees where publishMarketAddress is 0x7CfE08CF7FfA7E36284210861A6754816e2dA358 and fees>0.2

```
run cli claimPublishMarket 0x7CfE08CF7FfA7E36284210861A6754816e2dA358 0.2