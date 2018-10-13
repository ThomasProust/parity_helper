# Parity Helper

This is a small library of classes that simplify the interactions with a Parity ethereum node.

===============================

## Dependencies

web3 - axios - bignumber.js

===============================

## How to use

### Parity class

The Parity class can be used mostly to manage you ethereum node and to handle basic ethereum operations such as signing and transaction, sending a raw transaction, get a gas estimation or fetch a transaction from the ethereum blockchain.

#### Initialization

To be able to communicate with a Parity node via Json-RPC, you need to instantiate the Parity class with the endpoint hosting the node:

```
const endpoint = 'http://localhost:8545';
const parity = new Parity(endpoint);
```

#### Methods

1. Get Parity Accounts

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

2. Get Account By Name

Returns the address of a parity node account with the given name as argument

```
parity.getAccountByName('foobar')
	.catch(e => console.error(e))
	.then(result => console.log(result));

> "0x12333....";
```

3. Create Account

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

3. Edit Account

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

4. Delete Account

Delete a parity account at a specified address with the corresponding password.
Returns a boolean: true for success, false if failed, or no corresponding account found.

```
parity.deleteAccount('0x1233.....', 'password')
	.catch(e => console.error(e))
	.then(result => console.log(result));

> true;
```

5. Get All Local Transactions

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

6. Get Local Transaction

Returns the details of a specific local transaction by its hash.




