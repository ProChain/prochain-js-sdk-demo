//substrate
const Keyring = require('@polkadot/keyring').default;
const {
    ApiPromise,
    WsProvider
} = require('@polkadot/api');
const {
    stringToHex
} = require('@polkadot/util');

//prochain testnet endpoint
const WS_PROVIDER = 'wss://substrate.chain.pro/v2/ws';

const provider = new WsProvider(WS_PROVIDER);

//signer
const AUTH_ADDRESS = "5H6Lyq5TZKa8YzPwCgBgpYTNJVWKvWzMDVihTZMYk2mHiFi4";

const fs = require('fs')
const log4js = require('log4js')
log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: `./logs/creation.log`,
            layout: {
                type: 'pattern',
                pattern: '%d{MM/dd-hh:mm.ss.SSS} %p - %m',
            }
        }
    },
    categories: {
        default: {
            appenders: ['file'],
            level: 'debug'
        }
    }
})
const logger = log4js.getLogger()

const run = async () => {
    const api = await ApiPromise.create({
        provider,
        types: {
            "ExternalAddress": {
                "btc": "Vec<u8>",
                "eth": "Vec<u8>",
                "eos": "Vec<u8>"
            },
            "LockedRecords": {
                "locked_time": "Moment",
                "locked_period": "Moment",
                "locked_funds": "Balance",
                "rewards_ratio": "u64",
                "max_quota": "u64"
            },
            "UnlockRecords": {
                "unlock_time": "Moment",
                "unlock_funds": "Balance"
            },
            "MetadataRecord": {
                "address": "AccountId",
                "superior": "Hash",
                "creator": "AccountId",
                "did_ele": "Vec<u8>",
                "locked_records": "Option<LockedRecords<Balance, Moment>>",
                "unlock_records": "Option<UnlockRecords<Balance, Moment>>",
                "social_account": "Option<Hash>",
                "subordinate_count": "u64",
                "group_name": "Option<Vec<u8>>",
                "external_address": "ExternalAddress"
            },
            "AdsMetadata": {
                "advertiser": "Vec<u8>",
                "topic": "Vec<u8>",
                "total_amount": "Balance",
                "surplus": "Balance",
                "gas_fee_used": "Balance",
                "single_click_fee": "Balance",
                "create_time": "Moment",
                "period": "Moment"
            },
            "EventHTLC": {
                "eth_contract_addr": "Vec<u8>",
                "htlc_block_number": "BlockNumber",
                "event_block_number": "BlockNumber",
                "expire_height": "u32",
                "random_number_hash": "Vec<u8>",
                "swap_id": "Hash",
                "event_timestamp": "u64",
                "htlc_timestamp": "u64",
                "sender_addr": "Vec<u8>",
                "sender_chain_type": "HTLCChain",
                "receiver_addr": "AccountId",
                "receiver_chain_type": "HTLCChain",
                "recipient_addr": "Vec<u8>",
                "out_amount": "Balance",
                "event_type": "HTLCType"
            },
            "HTLCChain": {
                "_enum": [
                    "ETHMain",
                    "PRA"
                ]
            },
            "HTLCStates": {
                "_enum": [
                    "INVALID",
                    "OPEN",
                    "COMPLETED",
                    "EXPIRED"
                ]
            },
            "EventLogSource": {
                "event_name": "Vec<u8>",
                "event_url": "Vec<u8>"
            },
            "HTLCType": {
                "_enum": [
                    "HTLC",
                    "Claimed",
                    "Refunded"
                ]
            }
        }
    })
    console.log('api created -----')

    //https://polkadot.js.org/api/examples/promise/02_listen_to_blocks/
    let count = 0;

    const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
        console.log(`Chain is at block: #${header.number}`);

        if (++count === 5) {
            unsubscribe();
            process.exit(0);
        }
    });


    //https://polkadot.js.org/api/examples/promise/06_make_transfer/
    var res = fs.readFileSync(`./keys/${AUTH_ADDRESS}.json`, 'utf8');
    const keyring = new Keyring({
        type: 'sr25519'
    });
    const {
        seed
    } = JSON.parse(res.toString())
    const pair = keyring.addFromMnemonic(seed)

    //const nonce = await api.query.system.accountNonce(pair.address);

    //transfer to, with amount 0.1, persicion is 15
    const transfer = api.tx.balances.transfer("5HB5qLTfah2Bp8XUTNLaME5f2D1WW3xTger5PvXiXrNLi2SM", 100000000000000);
    const hash = await transfer.signAndSend(pair);
    console.log('Transfer sent with hash', hash.toHex());
}



run().catch(console.error);