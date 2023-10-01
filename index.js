const axios = require('axios');
const accounts = require('./accounts.json')

for (const account of accounts) {
    axios.get(`https://www.op.gg/_next/data/rqrYpMAq4Z_yEQbECOXJk/en_US/summoners/${account.region}/${encodeURIComponent(account.name)}.json`)
        .then(res => console.log(res.data.pageProps.data.level))
        .catch(err => console.log(err.message));
}

// axios.get(`https://www.op.gg/_next/data/rqrYpMAq4Z_yEQbECOXJk/en_US/summoners/euw/${encodeURIComponent('Hi im Sparky asdasdasdv2a')}.json`)
//     .then(res => console.log(res.data.pageProps.data.level))
//     .catch(err => console.log(err.message));