const fs = require('fs');
const requester = require('./requester.js');

function addAccount(account) {
    return new Promise(async (resolve, reject) => {
        try {
            let detailedAccount;

            try {
                detailedAccount = await requester.getAccount(account);

            } catch (error) {
                throw { message: error.message || 'An error occured while trying to check if the account exists!' };
            }

            fs.readFile('accounts.json', 'utf-8', (err, rawAccounts) => {
                if (err) reject(err.message);

                const accounts = JSON.parse(rawAccounts);

                if (accounts.find(x => x.accountId === detailedAccount.data.account.accountId)) return reject({ message: 'The account is already in the list!' });
                accounts.push({
                    name: detailedAccount.data.account.name,
                    region: (account.region).toUpperCase(),
                    accountId: detailedAccount.data.account.accountId
                })
                fs.writeFile('accounts.json', JSON.stringify(accounts), 'utf-8', (err) => {
                    if (err) return reject({ message: `An error occured when trying to save the account! \n Error: ${err?.message}` });

                    return resolve(detailedAccount);
                })
            });
        } catch (err) {
            return reject(err);
        }

    })
}

async function getAccountLevel(account) {
    try {
        try {
            const detailedAccount = await requester.getAccount(account);

            return {
                region: account.region.toUpperCase(),
                level: detailedAccount.data.account.summonerLevel
            };
        } catch (error) {
            throw { message: error.message || 'An error occured while trying to get information about the account!' };
        }
    } catch (err) {
        throw err;
    }
}

async function getDetailedAccount(account) {
    try {
        let detailedAccount;

        try {
            const accountResponse = await requester.getAccount(account);

            detailedAccount = {
                name: accountResponse.data.account.names[0].name,
                region: account.region,
                level: accountResponse.data.account.summonerLevel,
                latestGameTimestamp: null,
                accountId: accountResponse.data.account.accountId,
                puuid: accountResponse.data.account.puuid,
            };

            const matchesResponse = await requester.getMatches(detailedAccount);

            if (matchesResponse.data.matchesDetails.length) detailedAccount.latestGameTimestamp = Number(matchesResponse.data.matchesDetails[0].date);

        } catch (error) {
            throw { message: error.message || 'An error occured while trying to get information about the account!' };
        }

        let time = 'N/A';

        if (detailedAccount.latestGameTimestamp) {
            let date = detailedAccount.latestGameTimestamp;
            const currentDate = new Date().getTime();
            const timePassed = currentDate - date;

            if (timePassed / 8.64e+7 >= 1) {
                time = `${(timePassed / 8.64e+7).toFixed(0)} days ago.`
            } else if (timePassed / 3.6e+6 >= 1) {
                time = `${(timePassed / 3.6e+6).toFixed(0)} hours ago.`
            } else if (timePassed / 60000 >= 1) {
                time = `${(timePassed / 60000).toFixed(0)} minutes ago.`;
            } else {
                time = `${(timePassed / 1000).toFixed(0)} seconds ago.`;
            }
        }

        return {
            name: detailedAccount.name,
            level: detailedAccount.level,
            region: detailedAccount.region.toUpperCase(),
            lastGame: time
        };

    } catch (err) {
        throw err;
    }
}

function removeAccount(account) {
    return new Promise(async (resolve, reject) => {
        try {
            let detailedAccount;

            try {
                detailedAccount = await requester.getAccount(account);

            } catch (error) {
                detailedAccount = undefined;
            }

            fs.readFile('accounts.json', 'utf-8', (err, rawAccounts) => {
                if (err) return reject(err.message);;

                const accounts = JSON.parse(rawAccounts);
                let filteredAccounts = [];

                if (!detailedAccount) {
                    const accountToRemoveIndex = accounts.findIndex(x => x.name.toLowerCase() === account.name.toLowerCase() && x.region.toLowerCase() === account.region.toLowerCase());

                    if (accountToRemoveIndex !== -1) {
                        const firstPart = accounts.slice(0, accountToRemoveIndex);
                        const lastPart = accounts.slice(accountToRemoveIndex + 1, accounts.length);

                        filteredAccounts = firstPart.concat(lastPart);
                    } else {
                        return reject({ message: 'The account is not in the list!' });
                    }
                } else {
                    if (!accounts.find(x => x.accountId === detailedAccount.data.account.accountId)) return reject({ message: 'The account is not in the list!' });
                    filteredAccounts = accounts.filter(x => x.accountId !== detailedAccount.data.account.accountId)
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

function getAccounts(region, detailed = false) {
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
                    account.region = account.region.toLowerCase();
                    let checkedAccount;
                    if (detailed) {
                        checkedAccount = await getDetailedAccount(account);
                    } else {
                        checkedAccount = await getAccountLevel(account);
                    }
                    updatedAccounts.push(checkedAccount)

                } catch (err) {
                    if (err.message.includes('does not exist')) {
                        console.error(`An error occured while trying to get information about ${account.name} in ${account.region}! Skipping this account...`);
                        continue;
                    }
                    return reject(err);
                }
            }
            return resolve(region ? updatedAccounts.sort((a, b) => b.level - a.level) : updatedAccounts.sort((a, b) => (a.region).localeCompare(b.region) || b.level - a.level));
        });
    });
}

module.exports = { getAccounts, addAccount, removeAccount }