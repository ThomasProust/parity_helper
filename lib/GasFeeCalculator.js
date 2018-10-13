const { utils }     = require('web3');
const BigNumber     = require('bignumber.js');


class GasFeeCalculator extends Parity {

    static get FASTEST()    {  return 'fastest'; }
    static get FAST()       { return 'fast'; }
    static get AVERAGE()    { return 'average'; }
    static get SAFELOW()    { return 'safelow'; }

    static get WEI()    { return 'wei'; }
    static get GWEI()   { return 'gwei'; }
    static get ETHER()  { return 'ether'; }

    static get HEX()    { return 'hex'; }
    static get STRING() { return 'string'; }
    static get BG()     { return 'bg'; }

    static get GAS_DEFAULT() { return 21000; }



    constructor(endpoint, gas = GasFeeCalculator.GAS_DEFAULT) {
        super(endpoint);

        this.gas = new BigNumber(gas).toFixed();
    }

    getGas() {
        return this.gas;
    }

    /**
     *
     * @param fee
     * @param currency
     * @returns {*}
     */
    static setCurrency(fee, currency = GasFeeCalculator.GWEI) {

        if(fee === null) return null;
        if (typeof fee === 'number') fee = new BigNumber(fee).toFixed();

        let result;
        switch (currency) {

            case GasFeeCalculator.ETHER:
                const result_wei = utils.toWei(fee, 'gwei');
                result = utils.fromWei(result_wei, 'ether');
                break;

            case GasFeeCalculator.WEI:
                result = utils.toWei(fee, 'gwei');
                //console.debug(result);
                break;

            case GasFeeCalculator.GWEI:
                /* do nothing, keep it in gwei */
                result = fee;
                break;

            default:
                /* do nothing, keep it in gwei */
                result = fee;
                break;
        }
        return result;

    }

    /**
     *
     * @param fee
     * @param format
     * @returns {*}
     */
    static setFormat(fee, format = GasFeeCalculator.STRING) {

        if(fee === null) return null;

        let result;

        switch (format) {

            case GasFeeCalculator.STRING:
                result = new BigNumber(fee).toFixed();
                break;

            case GasFeeCalculator.HEX:
                result = utils.toHex(fee);
                break;

            case GasFeeCalculator.BG:
                result = new BigNumber(fee);
                break;

            default:
                result = new BigNumber(fee).toFixed();
                break;
        }
        return result;
    }

    /**
     *
     * @param speed
     * @returns {Promise<*>}
     */
    async getCurrentGasPrice(speed = null) {

        let gasPrice;


        try {

            gasPrice = await this.getGasPrice();
            gasPrice = GasFeeCalculator.setFormat(gasPrice, GasFeeCalculator.STRING);

        } catch(e) {

            console.error(e);
            return null;
        }

        switch(speed) {

            case GasFeeCalculator.FASTEST:
                gasPrice = gasPrice*10;
                break;

            case GasFeeCalculator.FAST:
                gasPrice = gasPrice*5;
                break;

            case GasFeeCalculator.AVERAGE:
                gasPrice = gasPrice*1.5;
                break;

            case GasFeeCalculator.SAFELOW:
                break;

            default:
                break;
        }

        return gasPrice.toString();
    }

    /**
     *
     * @param speed
     * @returns {Promise<*>}
     */
    async calculateFee(speed = null) {

        try {

            const gasPrice = await this.getGasPrice(speed);
            return (gasPrice * this.gas).toString();

        } catch(error) {

            console.error(error);
            return null;
        }

    }

    /**
     *
     * @param speed
     * @param currency
     * @param format
     * @returns {Promise<*>}
     */
    async getFee(speed = null, currency = null, format = null) {

        const fee = await this.calculateFee(speed);
        const curr_fee = GasFeeCalculator.setCurrency(fee * 10e-9, currency);

        return GasFeeCalculator.setFormat(curr_fee, format);
    }
}

module.exports = GasFeeCalculator;