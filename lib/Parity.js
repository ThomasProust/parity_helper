const { utils } = require('web3');
const JsonRpc	= require('./JsonRpc');

class Parity extends JsonRpc {

	constructor(endpoint) {
		super(endpoint);
	}

	/**
     *
     * @param bool
     * @returns {Promise<null>}
     */
     async getParityAccounts (bool = false)  {

        const method = !!bool ? "parity_allAccountsInfo" :  "personal_listAccounts";
        const body = JsonRPC.create(method);

        try {

            const { result } = await this.send(body);
            return result;

        } catch(e) {

            console.error(e);
            return null;
        }
    }

    /**
     *
     * @param alias
     * @returns {Promise<*>}
     */
    async getAccountByName(alias) {

        if(alias === null || alias === "") return null;

        try {

            const account_list = await this.getParityAccounts(true);

            const map = new Map(Object.entries({...account_list}));

            for(let [key, {name}] of map) {
                if (name === alias) {
                    return key;
                }
            }


        } catch(e) {

            console.error(e);
            return null;
        }
    }

    /**
     *
     * @param password
     * @returns {Promise<null>}
     */
     async createAccount (password) {

        const method = "personal_newAccount";
        const body = JsonRPC.create(method, [password]);

        try {

            const {result} = await this.send(body);
            return result;

        } catch(e) {

            console.error(e);
            return null;
        }
    }

    /**
     *
     * @param address
     * @param password
     * @param name
     * @param new_password
     * @returns {Promise<*>}
     */
     async editAccount (address, password, {name = null, new_password = null}) {

        if (name !== null) {
            const method = "parity_setAccountName";
            const body = JsonRPC.create(method, [address, name]);

            try {

                const {result} = await this.send(body);
                if (!result) return false;


            } catch(e) {

                console.error(e);
                return null;
            }
        }
        if (new_password !== null) {

            const method = "parity_changePassword";
            const body = JsonRPC.create(method, [address, password, new_password]);

            try {

                const {result} = await this.send(body);
                if (!result) return false;

            } catch(e) {

                console.error(e);
                return null;
            }
        }

        return true;
    }

    /**
     *
     * @param address
     * @param password
     * @returns {Promise<null>}
     */
     async deleteAccount(address, password) {

        const method = "parity_killAccount";
        const body = JsonRPC.create(method, [address, password]);

        try {

            const { result } = await this.send(body);
            return result;

        } catch(error) {

            console.error(error);
            return null;
        }
    }

    /**
     *
     * @param bool
     * @returns {Promise<*>}
     */
     async getAllLocalTransactions(bool = false) {

        const method = "parity_localTransactions";
        const body = JsonRPC.create(method);

        try {

            const { result } = await this.send(body);
            return !bool ? Object.keys(result) : result;


        } catch(error) {

            console.error(error);
            return null;
        }
    }

    /**
     *
     * @param address
     * @returns {Promise<*>}
     */
    async getLocalTransaction(address) {

         try {

             const transactions = await this.getAllLocalTransactions(true);
             const map = new Map(Object.entries({...transactions}));

             return map.get(address);

         } catch(error) {

             console.error(error);
             return null;
         }
    }

    /**
     *
     * @returns {Promise<null>}
     */
     async getAllQueueTransactions() {

        const method = "parity_allTransactions";
        const body = JsonRPC.create(method);

        try {

            const { result } = await this.send(body);
            return result;


        } catch(error) {

            console.error(error);
            return null;
        }
    }

    /**
     *
     * @returns {Promise<*>}
     */
     async removeAllLocalTransactions() {

         const local_transactions = await this.getAllLocalTransactions();
         const method = "parity_removeTransaction";
         const array = [];
         for(let tx of local_transactions) {
             const body = JsonRPC.create(method, [tx]);

             try {

                 const {result} = await this.send(body);
                 if (result !== null) array.push(result);

             } catch(error) {

                 console.error(error);

             }
         }
         return array;
     }

    /**
     *
     * @param address
     * @returns {Promise<*>}
     */
     async removeLocalTransaction(address) {

         const method = "parity_removeTransaction";
         const body = JsonRPC.create(method, [address]);

         try {

             const { result } = await this.send(body);
             return result;


         } catch(error) {

             console.error(error);
             return null;
         }
     }

     async getEstimateGas({ from = null, to = null, value = "0x0",  data = null}) {

         const method = "eth_estimateGas";
         const body = JsonRPC.create(method, [{from, to, value, data}]);
         try {

             const response = await this.send(body);
             console.warn(response);
             return response.result;


         } catch(error) {

             console.error(error);
             return null;
         }

     }

     async getGasPrice() {

         const method = "eth_gasPrice";
         const body = JsonRPC.create(method);
         try {

             const response = await this.send(body);
             //console.warn(response);
             return response.result;


         } catch(error) {

             console.error(error);
             return null;
         }
     }

    /**
     *
     * @param from
     * @returns {Promise<*>}
     */
     async getBalance(from) {

         const method = "eth_getBalance";
         const body = JsonRPC.create(method, [from]);

         try {

             const { result } = await this.send(body);
             return result;


         } catch(error) {

             console.error(error);
             return null;
         }
     }

    /**
     *
     * @param transaction
     * @param password
     * @returns {Promise<*>}
     */
     async signTransaction(transaction, password) {

         const method = "personal_signTransaction";
         const body = JsonRPC.create(method, [transaction, password]);

         try {

             const response = await this.send(body);
             //console.warn(response);
             return response.result;

         } catch(error) {

             console.error(error);
             return null;
         }
     }

     async sendRawTransaction(raw) {

         const method = "eth_sendRawTransaction";
         const body = JsonRPC.create(method, [raw]);

         try {

             const response = await this.send(body);
             //console.debug(response);
             return response.result;

         } catch(error) {

             console.error(error);
             return null;
         }
     }

     async getTransactionCount(address) {

         const method = "eth_getTransactionCount";
         const body = JsonRPC.create(method, [address]);

         try {

             const response = await this.send(body);
             //console.debug(response);
             return response.result;

         } catch(error) {

             console.error(error);
             return null;
         }
     }

     async getTransactionReceipt(hash) {

         const method = "eth_getTransactionReceipt";
         const body = JsonRPC.create(method, [hash]);

         try {

             const response = await this.send(body);
             //console.debug(response);
             return response.result;

         } catch(error) {

             console.error(error);
             return null;
         }

     }

     async getTransaction(hash) {

         const method = "eth_getTransactionByHash";
         const body = JsonRPC.create(method, [hash]);

         try {

             const response = await this.send(body);
             return response.result;

         } catch(e) {

             console.error(e);
             return null;
         }
     }

     async getNodePeers() {
         const method = "parity_netPeers";
         const body = JsonRPC.create(method);

         try {

             const response = await this.send(body);
             return response.result;

         } catch(e) {

             console.error(e);
             return null;
         }
     }
}


module.exports = Parity;