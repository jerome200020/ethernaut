# Ethernaut Solutions

A Hardhat 3 workspace for solving [Ethernaut](https://ethernaut.openzeppelin.com/) challenges on Sepolia. Each level gets an attack contract, an Ignition deployment module, and case notes in `docs/`.

## Setup

```bash
yarn install
cp .env.example .env  # fill in SEPOLIA_RPC_URL and PRIVATE_KEY
```

## Folder structure

```
contracts/      Attack contracts (one per level)
ignition/
  modules/      Ignition deployment modules for each attack contract
scripts/        Hardhat scripts for multi-step or repeated attacks
docs/           Case notes — vulnerability explanations and key takeaways
```

## How to run

**Compile contracts**
```bash
yarn compile
```

**Deploy an attack contract**

Parameters can be passed inline or via a JSON file in `ignition/parameters/`:

```bash
# inline
npx hardhat ignition deploy ignition/modules/CoinFlipAttacker.ts \
  --network sepolia \
  --parameters '{"CoinFlipAttacker":{"coinFlipAddr":"0x..."}}'

# via parameters file (ignition/parameters/CoinFlipAttacker.json)
npx hardhat ignition deploy ignition/modules/CoinFlipAttacker.ts \
  --network sepolia \
  --parameters ignition/parameters/CoinFlipAttacker.json
```

**Run an attack script**
```bash
npx hardhat run scripts/<script>.ts --network sepolia
# or via the shorthand for CoinFlip:
yarn attack
```

## Levels covered

| Level | Contract | Notes |
|---|---|---|
| CoinFlip | `CoinFlipAttacker.sol` | — |
| Telephone | `TelephoneAttacker.sol` | — |
| Force | `ForceAttack.sol` | — |
| Vault | — | `docs/private-storage.md` |

## Docs

- [`docs/overflow-underflow.md`](docs/overflow-underflow.md) — integer overflow & underflow in the EVM
- [`docs/private-storage.md`](docs/private-storage.md) — why `private` variables are readable on-chain
