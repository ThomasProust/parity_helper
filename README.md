# Parity Helper

This is a small library of classes that simplify the interactions with a Parity ethereum node.

-----------------------------------------

## Dependencies

web3 - axios - bignumber.js

-----------------------------------------

## Important Notes

As this module is heavily using ES6 syntax, it may not work properly if used in a browser.

-----------------------------------------

## How to use

### Parity class

The Parity class can be used mostly to manage you ethereum node and to handle basic ethereum operations such as signing and transaction, sending a raw transaction, get a gas estimation or fetch a transaction from the ethereum blockchain.

#### Initialization

To be able to communicate with a Parity node via Json-RPC, you need to instantiate the Parity class with the endpoint hosting the node:

```
const endpoint = 'http://localhost:8545';
const parity = new Parity(endpoint);
```
-----------------------------------------------

#### Node Management Methods

-----------------------------------------------

##### 1. Get Parity Accounts

Get a list of every account creating inside the parity node hosted at the endpoint. Accepts an optional boolean argument (default to false). If this argument is equal to false, then the return value is an array of ethereum addresses. If it is true, it returns an Object with the account address as key, and the accounts details as value.

```
parity.getParityAccounts()
	.catch(e => console.error(e))
	.then(result => console.log(result));

;

> [
	'0x12333.....',
	'0x45544.....',
	'0xh4542.....',
	...
]
```

```
parity.getParityAccounts(true)
	.catch(e => console.error(e))
	.then(result => console.log(result));

> {
	"0x12333....": {
		"meta": "{}",
		"name": "foobar",
		"uuid": "0b9e70e6-235b-682d-a15c-2a98c71b3945"
	},
	"0x45544....": {
		"meta": "{}",
		"name": "foofoobar",
		"uuid": "0r2e34e6-958b-432u-f98v-4op99c72e8907"
	}
}
```

##### 2. Get Account By Name

Returns the address of a parity node account with the given name as argument

```
parity.getAccountByName('foobar')
	.catch(e => console.error(e))
	.then(result => console.log(result));

> "0x12333....";
```

##### 3. Create Account

Create an account inside the parity node by providing a password.
Be very wary not to loose this password and to protect it properly because it is the only way to use this account.
Loose this password and you will not be able to access this account.
Anyone who has access to this password can freely send transactions with this account and delete this account as well.

```
parity.createAccount('password')
	.catch(e => console.error(e))
	.then( result => console.log(result));

> "0x7896....";
```

##### 4. Edit Account

Allows the user to change the name and/or the password of a given account in the parity node.
The  first two arguments to provide are the address of the account, and its password. (Be cautious here as the password will be sent without any encryption via Json-RPC).
The third argument is an object containing the attributes to modify (name and/or new_password).

Returns a boolean: true for success, false if failed.

```
const new_data = { name: "foobarbar", new_password: "newPassWord"};

parity.editAccount('old_name', 'old_password', new_data)
	.catch(e => console.error(e))
	.then(result => console.log(result));

> true;
```

##### 5. Delete Account

Delete a parity account at a specified address with the corresponding password.
Returns a boolean: true for success, false if failed, or no corresponding account found.

```
parity.deleteAccount('0x1233.....', 'password')
	.catch(e => console.error(e))
	.then(result => console.log(result));

> true;
```

##### 6. Get All Local Transactions

returns a list of all local transactions in the parity node.
Takes a boolean as argument (default to false). 
If true, the result will be an object with transaction hash as key, and the transaction details as value.
if false, the result will an array containing the hash of the local transactions.

```
parity.getAllLocalTransactions(true)
	.catch(e => console.error(e))
	.then(result => console.log(result));

> {
    "0x09e64eb1ae32bb9ac415ce4ddb3dbad860af72d9377bb5f073c9628ab413c532": {
      "status": "mined",
      "transaction": {
        "from": "0x00a329c0648769a73afac7f9381e08fb43dbea72",
        "to": "0x00a289b43e1e4825dbedf2a78ba60a640634dc40",
        "value": "0xfffff",
        "blockHash": null,
        "blockNumber": null,
        "creates": null,
        "gas": "0xe57e0",
        "gasPrice": "0x2d20cff33",
        "hash": "0x09e64eb1ae32bb9ac415ce4ddb3dbad860af72d9377bb5f073c9628ab413c532",
        "input": "0x",
        "condition": {
          "block": 1
        },
        "networkId": null,
        "nonce": "0x0",
        "publicKey": "0x3fa8c08c65a83f6b4ea3e04e1cc70cbe3cd391499e3e05ab7dedf28aff9afc538200ff93e3f2b2cb5029f03c7ebee820d63a4c5a9541c83acebe293f54cacf0e",
        "raw": "0xf868808502d20cff33830e57e09400a289b43e1e4825dbedf2a78ba60a640634dc40830fffff801ca034c333b0b91cd832a3414d628e3fea29a00055cebf5ba59f7038c188404c0cf3a0524fd9b35be170439b5ffe89694ae0cfc553cb49d1d8b643239e353351531532",
        "standardV": "0x1",
        "v": "0x1c",
        "r": "0x34c333b0b91cd832a3414d628e3fea29a00055cebf5ba59f7038c188404c0cf3",
        "s": "0x524fd9b35be170439b5ffe89694ae0cfc553cb49d1d8b643239e353351531532",
        "transactionIndex": null
      }
    },
    "0x...": { ... }
  }


  parity.getAllLocalTransactions()
  	.catch(e => console.error(e))
  	.then(result => console.log(result));

  > [
  	"0x09e64eb1ae32bb9ac415ce4ddb3dbad860af72d9377bb5f073c9628ab413c532",
  	"0x56t909fj4e5df99530gt69hh493g19t4lk4tra9980djl5j5k6jr09922kd74559",
  	...
  ]
```

##### 7. Get Local Transaction

Returns the details of a specific local transaction by its hash.

```
parity.getLocalTransaction('0x09e64eb1ae32bb9ac415ce4ddb3dbad860af72d9377bb5f073c9628ab413c532')
	.catch(e => console.error(e));
	.then(result => console.log(result));

> "status": "mined",
      "transaction": {
        "from": "0x00a329c0648769a73afac7f9381e08fb43dbea72",
        "to": "0x00a289b43e1e4825dbedf2a78ba60a640634dc40",
        "value": "0xfffff",
        "blockHash": null,
        "blockNumber": null,
        "creates": null,
        "gas": "0xe57e0",
        "gasPrice": "0x2d20cff33",
        "hash": "0x09e64eb1ae32bb9ac415ce4ddb3dbad860af72d9377bb5f073c9628ab413c532",
        "input": "0x",
        "condition": {
          "block": 1
        },
        "networkId": null,
        "nonce": "0x0",
        "publicKey": "0x3fa8c08c65a83f6b4ea3e04e1cc70cbe3cd391499e3e05ab7dedf28aff9afc538200ff93e3f2b2cb5029f03c7ebee820d63a4c5a9541c83acebe293f54cacf0e",
        "raw": "0xf868808502d20cff33830e57e09400a289b43e1e4825dbedf2a78ba60a640634dc40830fffff801ca034c333b0b91cd832a3414d628e3fea29a00055cebf5ba59f7038c188404c0cf3a0524fd9b35be170439b5ffe89694ae0cfc553cb49d1d8b643239e353351531532",
        "standardV": "0x1",
        "v": "0x1c",
        "r": "0x34c333b0b91cd832a3414d628e3fea29a00055cebf5ba59f7038c188404c0cf3",
        "s": "0x524fd9b35be170439b5ffe89694ae0cfc553cb49d1d8b643239e353351531532",
        "transactionIndex": null
      }
    }
```

##### 8. Get All Transaction Queue

returns array containing the details of every pending transaction currently in the queue of the parity node.

```
parity.getAllTransactionQueue()
	.catch(e => console.error(e))
	.then(result => console.log(result));
	
> [{
        "blockHash": null,
        "blockNumber": null,
        "chainId": null,
        "condition": null,
        "creates": null,
        "from": "0x5f3dffcf347944d3739b0805c934d86c8621997f",
        "gas": "0x493e0",
        "gasPrice": "0x12a05f200",
        "hash": "0x045301a128ffcb4662dd199d1176bdf4cc9f0628e10d6bf120edfb52e3e39a78",
        "input": "0x13f56f730...f3b4dc000",
        "nonce": "0x577",
        "publicKey": "0x3bb...9ce1b1",
        "r": "0x6fd2c7a5dbb8795038ca258196083b3eabe15a20e3020c3f45e88f2e447be410",
        "raw": "0xf88b8247d202...83eef3f8916bb818ce7",
        "s": "0x5993992c547d20234aabfc8c32a58d25784255fef500383eef3f8916bb818ce7",
        "standardV": "0x0",
        "to": "0xe8b2d01ffa0a15736b2370b6e5064f9702c891b6",
        "transactionIndex": null,
        "v": "0x1b",
        "value": "0x0"
    }, { .. }, { .. }]
```

##### 9. Remove All Local Transactions

Delete every local transaction that hasn't entered the queue from the node (doing so allows you to resend the transaction without having to increment the nonce).
Returns an array containing the details of each transaction removed, or null.

```
parity.removeAllLocalTransactions()
    .catch(e => console.error(e))
    .then(result => console.log(result));

> [
    {
      "blockHash": null,
      "blockNumber": null,
      "creates": null,
      "from": "0xee3ea02840129123d5397f91be0391283a25bc7d",
      "gas": "0x23b58",
      "gasPrice": "0xba43b7400",
      "hash": "0x160b3c30ab1cf5871083f97ee1cee3901cfba3b0a2258eb337dd20a7e816b36e",
      "input": "0x095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d5555555555",
      "condition": {
        "block": 1
      },
      "networkId": 1,
      "nonce": "0x5",
      "publicKey": "0x96157302dade55a1178581333e57d60ffe6fdf5a99607890456a578b4e6b60e335037d61ed58aa4180f9fd747dc50d44a7924aa026acbfb988b5062b629d6c36",
      "r": "0x92e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1",
      "raw": "0xf8aa05850ba43b740083023b5894bb9bc244d798123fde783fcc1c72d3bb8c18941380b844095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d555555555526a092e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1a062b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8",
      "s": "0x62b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8",
      "standardV": "0x1",
      "to": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
      "transactionIndex": null,
      "v": "0x26",
      "value": "0x0"
    },
    { ... },
    { ... }
  ];
  ```

##### 10. Remove All Local Transactions

Delete a local transaction with a given hash that hasn't entered the queue from the node (doing so allows you to resend the transaction without having to increment the nonce).
Returns the details of the transaction removed, or null.

```
parity.removeLocalTransaction("0x160b3c30ab1cf5871083f97ee1cee3901cfba3b0a2258eb337dd20a7e816b36e")
    .catch(e => console.error(e))
    .then(result => console.log(result));

>
    {
      "blockHash": null,
      "blockNumber": null,
      "creates": null,
      "from": "0xee3ea02840129123d5397f91be0391283a25bc7d",
      "gas": "0x23b58",
      "gasPrice": "0xba43b7400",
      "hash": "0x160b3c30ab1cf5871083f97ee1cee3901cfba3b0a2258eb337dd20a7e816b36e",
      "input": "0x095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d5555555555",
      "condition": {
        "block": 1
      },
      "networkId": 1,
      "nonce": "0x5",
      "publicKey": "0x96157302dade55a1178581333e57d60ffe6fdf5a99607890456a578b4e6b60e335037d61ed58aa4180f9fd747dc50d44a7924aa026acbfb988b5062b629d6c36",
      "r": "0x92e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1",
      "raw": "0xf8aa05850ba43b740083023b5894bb9bc244d798123fde783fcc1c72d3bb8c18941380b844095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d555555555526a092e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1a062b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8",
      "s": "0x62b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8",
      "standardV": "0x1",
      "to": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
      "transactionIndex": null,
      "v": "0x26",
      "value": "0x0"
    };
```

##### 11.Get Node Peers

Returns an object containing the number of active peers, connected peers, max number of connected peers, and list of all peers  with details .

```
parity.getNodePeers()
    .catch(e => console.error(e))
    .then(result => console.log(result));

> {
    "active": 0,
    "connected": 25,
    "max": 25,
    "peers": [{ ... }, { ... }, { ... }, ...]
  };
```

-----------------------------------------

#### Ethereum related methods

-----------------------------------------

##### 1. Get Estimated Gas

Returns an estimation of the gas units required for a transaction in `hex` format.
This method takes an object containing the following transaction elements as argument : `from`, `to` , `value`, `data`.
Every parameter is optional, except `to` which is required for a contract creation.


```
const transaction = {
    from: "0xee3ea02840129123d5397f91be0391283a25bc7d",
    to: "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
    value: '0x3' // has to be Hex format
    data: null
};

parity.getEstimateGas(transaction)
    .catch(e => console.error(e))
    .then(result => console.log(result));

> "0x5208"; //2100 for a regular transaction
```

##### 2. Get Gas Price

Returns the current average gas price in `wei` with a `hex` format.

```
parity.getGasPrice()
    .catch(e => console.error(e))
    .then(result => console.log(result));

> "0x9184e72a000";
```

##### 3. Get Balance

Returns the Ether balance at a specified address in `wei` format.
The balance is given in `wei`.

```
parity.getBalance("0xee3ea02840129123d5397f91be0391283a25bc7d
    .catch(e => console.error(e))
    .then(result => console.log(result));

> "0x0234c8a3397aab58";
```

##### 4. Sign Transaction

This method allows the user to sign a transaction using a parity account.
The sender of the transaction must be an account from the parity node. The password must correspond to the sender account.
The return value is an object containing the raw encoded signed transaction, and the transaction details.
Two arguments are required: a transaction object, and the password corresponding to the signing account.
All numeric values inside the transaction object must be in `hex` format.
The transaction object, in order to be valid, must at least contains a `from` attribute, with a value of type `string` corresponding to address of a parity node account.

```
const transaction = {
    from: "0xee3ea02840129123d5397f91be0391283a25bc7d",
    to: "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
    value: "0x0234c8a3397aab58",
    gas: "0x5208",
    gasPrice: "0x9184e72a000",
    data: "0x095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d5555555555",
    nonce: "0x1"
};

parity.signTransaction(transaction, "password")
    .catch(e => console.error(e))
    .then(result => console.log(result));

> {
    "raw": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
    "tx": {
      "hash": "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
      "nonce": "0x0", // 0
      "blockHash": "0xbeab0aa2411b7ab17f30a99d3cb9c6ef2fc5426d6ad6fd9e2a26a6aed1d1055b",
      "blockNumber": "0x15df", // 5599
      "transactionIndex": "0x1", // 1
      "from": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
      "to": "0x853f43d8a49eeb85d32cf465507dd71d507100c1",
      "value": "0x7f110", // 520464
      "gas": "0x7f110", // 520464
      "gasPrice": "0x09184e72a000",
      "input": "0x603880600c6000396000f300603880600c6000396000f3603880600c6000396000f360"
    }
  }
  ```

##### 5. Send Raw Transaction

This methods will send a signed transaction using it's raw encoded attribute.
Returns the hash of the transaction.

```
const raw = "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675";

parity.sendRawTransaction(raw)
    .catch(e => console.error(e))
    .then(result => console.log(result));

> "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273311";
```

##### 6. Get Transaction Count

Return the number of transactions sent by one address in `hex` format.
This method takes an ethereum address as argument.

```
parity.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
    .catch(e => console.error(e))
    .then(result => console.log(result));

> "0x1"; // 1 in Hex format
```

##### 7. Get Transaction Receipt

Returns the receipt of a transaction. (The receipt can be obtained even if the transaction is still pending).
This methods takes the hash of a transaction as only argument.

```
parity.getTransactionReceipt("0x444172bef57ad978655171a8af2cfd89baa02a97fcb773067aef7794d6913374")
    .catch(e => console.error(e))
    .then(result => console.log(result));

> {
        "blockHash": "0x67c0303244ae4beeec329e0c66198e8db8938a94d15a366c7514626528abfc8c",
        "blockNumber": "0x6914b0",
        "contractAddress": "0x471a8bf3fd0dfbe20658a97155388cec674190bf", // or null, if none was created
        "from": "0xc931d93e97ab07fe42d923478ba2465f2",
        "to": null,  // value is null because this example transaction is a contract creation
        "cumulativeGasUsed": "0x158e33",
        "gasUsed": "0xba2e6",
        "logs": [], 
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "root": null,
        "status": "0x1",
        "transactionHash": "0x444172bef57ad978655171a8af2cfd89baa02a97fcb773067aef7794d6913374",
        "transactionIndex": "0x4"
    };
```

##### 8. Get Transaction

Returns the details of a given transaction.
This method takes the hash of the transaction as only argument.

```
parity.getTransaction("0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b")
    .catch(e => console.error(e))
    .then(result => console.log(result));

> {
    "hash": "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "nonce": "0x0", // 0
    "blockHash": "0xbeab0aa2411b7ab17f30a99d3cb9c6ef2fc5426d6ad6fd9e2a26a6aed1d1055b",
    "blockNumber": "0x15df", // 5599
    "transactionIndex": "0x1", // 1
    "from": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    "to": "0x853f43d8a49eeb85d32cf465507dd71d507100c1",
    "value": "0x7f110", // 520464
    "gas": "0x7f110", // 520464
    "gasPrice": "0x09184e72a000",
    "input": "0x603880600c6000396000f300603880600c6000396000f3603880600c6000396000f360"
  }

```

----------------------------------------------

### GasFeeCalculator class

The GasFeeCalculator is a utility class allowing the user to obtained the current gas Price according to the desired speed of the transaction and to calculate the total fee of transaction. It also allows to get these data under different formats and currencies.

#### Instantiation

The GasFeeCalculator gets instantiated with two arguments:
An endpoint hosting a parity node (use to query to current gasPrice) and, optionally, an amount of gas (type `string`, `hex` or `number`);

```
const endpoint = http://localhost:8545
const gas = 21000; // or "21000" or "0x5208"

const calc = new GasFeeCalculator(endpoint, gas);
```

---------------------------------------------------

#### Static Constants and Methods

To avoid spelling mistakes or typos and for convenience, The GasFeeCalculator comes with a set of constants.

##### 1. Constants

```
    // transaction speeds
    GasFeeCalculator.FASTEST    = 'fastest'; 
    GasFeeCalculator.FAST       = 'fast';   
    GasFeeCalculator.AVERAGE    = 'average';  
    GasFeeCalculator.SAFELOW    = 'safelow';

    // currencies
    GasFeeCalculator.WEI        = 'wei'; 
    GasFeeCalculator.GWEI       = 'gwei'; 
    GasFeeCalculator.ETHER.     = 'ether'

    // formats
    GasFeeCalculator.HEX.       = 'hex';
    GasFeeCalculator.STRING.    = 'string';
    GasFeeCalculator.BG.        = 'bg';

    // standard gas value
    GasFeeCalculator.GAS_DEFAULT = 21000;
```

##### 2. Static Methods

###### Set Currency

This static method allows the user to convert a fee from `gwei` to either `ether` or `wei`.
The first argument, the fee must be a numeric value of type `string`, `number` or `hex` and is considered to be in `gwei`.
The second argument is the desired currency output.
The return value is of type string.

```
const fee = 1 // gwei

const fee_in_wei = GasFeeCalculator.setCurrency(fee, GasFeeCalculator.WEI);
console.log(fee_in_wei);

> "1000000000";
```

###### Set Format

This static method allows the user to convert a value of type `string` or `number` into a value of type `hex`, `big number` or `string`.
The first argument, the fee must be a numeric value of type `string` or `number`.
The second argument is the desired type of the output: `hex`, `string` or `bg` (default to `string` if argument is null).

```
const fee = 21000 // type number

const fee_hex = GasCalculatorFee.setFormat(fee, GasFeeCalculator.HEX);
console.log(fee_hex);

> "0x5208";
```

##### 3. Methods

###### Get Gas

This is a simple getter that return the amount of gas the GasFeeCalculator has been instantiated with converted to a string.

```
const calc = new GasFeeCalculator(endpoint, 21000);

const gas = calc.getGas();

> "21000"; // Always converted to type string
```

###### Get Current Gas Price

This method will return a gasPrice value in `wei` of type string in correlation with a desired transaction speed.
It takes one argument of type string that can have the following values: `"fastest"`, `"fast"`, `"average"`, `"safelow"`(you can use the constants mentionned above). If the argument is null, then `"average"` will be used as default.

```
const calc = new GasFeeCalculator();

calc.getCurrentGasPrice(GasFeeCalculator.AVERAGE)
    .catch(e => console.error(e))
    .then(result => console.log(result));

> "15000000000"
```

###### Get Fee

This method will calculate the total fee in gas with a given currency and a given format.
This method takes 3 optional arguments: speed, currency, format (you can use above constants to avoid mistakes);

```
const gas = 21000;
const calc = new GasFeeCalculator(gas);

calc.getFee(GasFeeCalculator.FASTEST, GasFeeCalculator.ETHER, GasFeeCalculator.STRING)
    .catch(e => console.error(e))
    .then(result => console.log(result));

> "0.000021";
```



