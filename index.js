const axios = require('axios');
const accounts = require('./accounts.json')
const { addAccount, getAccountDetails } = require('./src/accountsService.js');

async function start() {
    for (const account of accounts) {
        try {
            await axios.post(`https://op.gg/api/v1.0/internal/bypass/summoners/${account.region}/${account.summonerId}/renewal`);
            const checkedAccount = await getAccountDetails(account);

            if(!checkedAccount.name) continue;

            console.log(checkedAccount);
    
        } catch (err) {
            console.log(err.message);
        }
    }
}

addAccount({name: 'Hi im Sparky v2', region: 'eune'});