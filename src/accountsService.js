const axios = require('axios');
const fs = require('fs');

async function addAccount(account) {
    try {
        const detailedAccount = await axios.get(`https://www.op.gg/_next/data/rqrYpMAq4Z_yEQbECOXJk/en_US/summoners/${account.region}/${encodeURIComponent(account.name)}.json`);

        fs.readFile('accounts.json', 'utf-8', (err, rawAccounts) => {
            if (err) console.log(err.message);;

            const accounts = JSON.parse(rawAccounts);

            if (accounts.find((x) => x.summonerId === detailedAccount.data.pageProps.data.summoner_id)) return console.log('The account is already in the list!');
            accounts.push({
                name: detailedAccount.data.pageProps.data.name,
                region: (detailedAccount.data.pageProps.region).toUpperCase(),
                summonerId: detailedAccount.data.pageProps.data.summoner_id
            })
            fs.writeFile('accounts.json', JSON.stringify(accounts), 'utf-8', (err) => {
                if (err) return console.log(`An error occured when trying to save the account! \n Error: ${err.message}`);

                console.log('Successfully saved the account!');
            })
        })

    } catch (err) {
        console.log(err.message);
    }
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