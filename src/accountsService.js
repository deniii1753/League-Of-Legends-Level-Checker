const axios = require('axios');
const fs = require('fs');
const accounts = require('../accounts.json');

function addAccount(account) {
    console.log(accounts);
    // fs.writeFile("accounts.json", )
}

async function getAccountDetails(account) {
    try {
        const res = await axios.get(`https://www.op.gg/_next/data/rqrYpMAq4Z_yEQbECOXJk/en_US/summoners/${account.region}/${encodeURIComponent(account.name)}.json`);

        return {
            name: res.data.pageProps.data.name,
            level: res.data.pageProps.data.level,
            region: (res.data.pageProps.region).toUpperCase()
        }
    } catch (err) {
        return err;
    }
}

module.exports = { addAccount, getAccountDetails }