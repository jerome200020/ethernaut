# Private Variables Are Not Private On-Chain

## Ethernaut context (Vault)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {
    bool public locked;
    bytes32 private password;

    constructor(bytes32 _password) {
        locked = true;
        password = _password;
    }

    function unlock(bytes32 _password) public {
        if (password == _password) {
            locked = false;
        }
    }
}
```

Goal: call `unlock()` with the correct password, even though it is marked `private`. Read slot 1 directly from storage to retrieve it, then pass the raw bytes32 value to `unlock()`.

---


The `private` keyword in Solidity only restricts *other contracts* from reading a variable via normal function calls. It does nothing to hide the data from anyone who can read the blockchain directly.

## How contract storage works

Every contract has a storage space made up of 2^256 slots, each 32 bytes wide. Variables are laid out sequentially starting at slot 0.

```solidity
contract Vault {
    bool public locked;     // slot 0
    bytes32 private password; // slot 1
}
```

Even though `password` is `private`, it sits at slot 1 in plaintext on every node in the network.

---

## Reading a storage slot directly

**web3.js**
```js
const value = await web3.eth.getStorageAt(contractAddress, 1)
```

**ethers.js**
```js
const value = await provider.getStorage(contractAddress, 1)
```

**viem**
```js
const value = await publicClient.getStorageAt({ address: contractAddress, slot: toHex(1) })
```

---

## Decoding the value

The returned value is a hex-encoded bytes32. If it was stored as a string/ASCII it can be decoded:

**web3.js**
```js
web3.utils.hexToAscii(value) // "A very strong secret password :)"
```

**ethers.js**
```js
ethers.toUtf8String(value) // "A very strong secret password :)"
```

**viem**
```js
import { hexToString } from "viem"
hexToString(value) // "A very strong secret password :)"
```

But you don't need to decode it — you can pass the raw hex directly to any function expecting `bytes32`.

---

## Why it matters

Any sensitive value ever written to contract storage (passwords, seeds, keys) is permanently readable regardless of its Solidity visibility modifier. This includes:

- `private` and `internal` state variables
- Variables set only in the constructor and never exposed
- Values that have since been overwritten (visible in historical state)

---

## The fix

Never store secrets on-chain. If a mechanism requires a secret, use a **commit-reveal scheme** — the user commits a hash of the secret first, then reveals the plaintext later in a separate transaction.
