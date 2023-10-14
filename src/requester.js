const axios = require('axios');
const baseUrl = `https://api.leaguestats.gg`;

const getAccount = async (account) => {
    const res = await axios.post(`${baseUrl}/summoner/basic`, {
        region: `${account.region === 'eune' ? 'eun1' : `${account.region}1`}`,
        summoner: account.name
    });

    if(res.status === 204) throw new Error('The account does not exist!');
    return res;
}

module.exports = {
    getAccount
}