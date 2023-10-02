const axios = require('axios');
const fs = require('fs');

function addAccount(account) {
    return new Promise(async (resolve, reject) => {
        try {
            const detailedAccount = await axios.get(`https://www.op.gg/_next/data/rqrYpMAq4Z_yEQbECOXJk/en_US/summoners/${account.region}/${encodeURIComponent(account.name)}.json`);

            if (!detailedAccount.data.pageProps.data.name) return reject({ message: 'The account does not exist!' });

            fs.readFile('accounts.json', 'utf-8', (err, rawAccounts) => {
                if (err) reject(err.message);

                const accounts = JSON.parse(rawAccounts);

                if (accounts.find(x => x.summonerId === detailedAccount.data.pageProps.data.summoner_id)) return reject({ message: 'The account is already in the list!' });
                accounts.push({
                    name: detailedAccount.data.pageProps.data.name,
                    region: (detailedAccount.data.pageProps.region).toUpperCase(),
                    summonerId: detailedAccount.data.pageProps.data.summoner_id
                })
                fs.writeFile('accounts.json', JSON.stringify(accounts), 'utf-8', (err) => {
                    if (err) reject({ message: `An error occured when trying to save the account! \n Error: ${err?.message}` });

                    return resolve(account);
                })
            });
        } catch (err) {
            return reject(err);
        }

    })
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

function removeAccount(account) {
    return new Promise(async (resolve, reject) => {
        try {
            const detailedAccount = await axios.get(`https://www.op.gg/_next/data/rqrYpMAq4Z_yEQbECOXJk/en_US/summoners/${account.region}/${encodeURIComponent(account.name)}.json`);

            if (!detailedAccount.data.pageProps.data.name) return reject({message: 'The account does not exist!'});

            fs.readFile('accounts.json', 'utf-8', (err, rawAccounts) => {
                if (err) return reject(err.message);;

                const accounts = JSON.parse(rawAccounts);
                if (!accounts.find(x => x.summonerId === detailedAccount.data.pageProps.data.summoner_id)) return reject({message: 'The account is not in the list!'});

                fs.writeFile('accounts.json', JSON.stringify(accounts.filter(x => x.summonerId !== detailedAccount.data.pageProps.data.summoner_id)), 'utf-8', (err) => {
                    if (err) return reject({message: `An error occured when trying to remove the account! \n Error: ${err.message}`});

                    return resolve(account);
                })
            });

        } catch (err) {
            return reject(err);
        }
    })
}

function getAllAccounts() {
    return new Promise((resolve, reject) => {
        fs.readFile('accounts.json', 'utf-8', async (err, rawAccounts) => {
            if (err) return reject(err.message);

            const accounts = JSON.parse(rawAccounts);
            const updatedAccounts = [];

            for (const account of accounts) {
                try {
                    await axios.post(`https://op.gg/api/v1.0/internal/bypass/summoners/${account.region}/${account.summonerId}/renewal`);
                    const checkedAccount = await getAccountDetails(account);
                    updatedAccounts.push(checkedAccount);
                } catch (err) {
                    return reject(err.message);
                }
            }
            return resolve(updatedAccounts);
        });
    });
}

module.exports = { getAllAccounts, addAccount, removeAccount }