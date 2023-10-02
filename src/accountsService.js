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

                    return resolve({
                        name: detailedAccount.data.pageProps.data.name,
                        region: detailedAccount.data.pageProps.region
                    });
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

        const date = new Date(res.data.pageProps.games.meta.first_game_created_at).getTime();
        const currentDate = new Date().getTime();

        const timePassed = currentDate - date;

        let time = '';

        if (timePassed / 8.64e+7 >= 1) {
            time = `${(timePassed / 8.64e+7).toFixed(0)} days ago.`
        } else if (timePassed / 3.6e+6 >= 1) {
            time = `${(timePassed / 3.6e+6).toFixed(0)} hours ago.`
        } else if (timePassed / 60000 >= 1) {
            time = `${(timePassed / 60000).toFixed(0)} minutes ago.`;
        } else {
            time = `${(timePassed / 1000).toFixed(0)} seconds ago.`;
        }
        return {
            name: res.data.pageProps.data.name,
            level: res.data.pageProps.data.level,
            region: (res.data.pageProps.region).toUpperCase(),
            lastGame: time
        }
    } catch (err) {
        return err;
    }
}

function removeAccount(account) {
    return new Promise(async (resolve, reject) => {
        try {
            const detailedAccount = await axios.get(`https://www.op.gg/_next/data/rqrYpMAq4Z_yEQbECOXJk/en_US/summoners/${account.region}/${encodeURIComponent(account.name)}.json`);

            fs.readFile('accounts.json', 'utf-8', (err, rawAccounts) => {
                if (err) return reject(err.message);;

                const accounts = JSON.parse(rawAccounts);
                let filteredAccounts = [];

                if (!detailedAccount.data.pageProps.data.name) {
                    const accountToRemoveIndex = accounts.findIndex(x => x.name.toLowerCase() === account.name.toLowerCase() && x.region.toLowerCase() == account.region.toLowerCase());

                    if (accountToRemoveIndex !== -1) {
                        const firstPart = accounts.slice(0, accountToRemoveIndex);
                        const lastPart = accounts.slice(accountToRemoveIndex + 1, accounts.length);

                        filteredAccounts = firstPart.concat(lastPart);
                    } else {
                        return reject({ message: 'The account does not exist!' });
                    }
                } else {
                    if (!accounts.find(x => x.summonerId === detailedAccount.data.pageProps.data.summoner_id)) return reject({ message: 'The account is not in the list!' });
                    filteredAccounts = accounts.filter(x => x.summonerId !== detailedAccount.data.pageProps.data.summoner_id)
                }

                fs.writeFile('accounts.json', JSON.stringify(filteredAccounts), 'utf-8', (err) => {
                    if (err) return reject({ message: `An error occured when trying to remove the account! \n Error: ${err.message}` });

                    return resolve({
                        name: account.name,
                        region: account.region.toUpperCase()
                    });
                })
            });

        } catch (err) {
            return reject(err);
        }
    })
}

function getAccounts(region) {
    return new Promise((resolve, reject) => {
        fs.readFile('accounts.json', 'utf-8', async (err, rawAccounts) => {
            if (err) return reject(err.message);

            const accountsFromList = JSON.parse(rawAccounts);
            let filteredAccounts = [];

            if (region) {
                filteredAccounts = accountsFromList.filter(x => x.region === region);
                if (!filteredAccounts.length) return reject({ message: 'There are no accounts in this region!' });

            } else {
                filteredAccounts = accountsFromList;
                if (!filteredAccounts.length) return reject({ message: 'There are no accounts in the list!' });
            }


            const updatedAccounts = [];

            for (const account of filteredAccounts) {
                try {
                    await axios.post(`https://op.gg/api/v1.0/internal/bypass/summoners/${account.region}/${account.summonerId}/renewal`);
                    const checkedAccount = await getAccountDetails(account);
                    if (checkedAccount.hasOwnProperty('name')) {
                        updatedAccounts.push(checkedAccount)
                    } else {
                        console.log(`An error occured while trying to get information about ${account.name} in ${account.region}! Skipping this account...`);
                    }

                } catch (err) {
                    return reject(err.message);
                }
            }
            return resolve(region ? updatedAccounts.sort((a, b) => b.level - a.level) : updatedAccounts.sort((a, b) => (a.region).localeCompare(b.region) || b.level - a.level));
        });
    });
}

module.exports = { getAccounts, addAccount, removeAccount }