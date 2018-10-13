const axios = require('axios');

class JsonRpc {

	constructor(endpoint) {
		this.url = endpoint;
		this.options = {
			headers: { 'content/type': 'application/json' },
			json: true
		};
	}

	static create(method, params = []) {
		return{ "method": method, "params": params, "id": 1, "jsonrpc": "2.0" };
	}

	async send(body) {
		try {
			const {data} = await axios.post(this.url, body, this.options);
			return data;
		} catch(e) {
			console.error(e);
			return null;
		}
	}
}

module.exports = JsonRpc;