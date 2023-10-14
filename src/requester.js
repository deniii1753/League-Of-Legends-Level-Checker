const axios = require('axios');
const baseUrl = `https://api.leaguestats.gg`;

const getAccount = async (account) => {
    const res = await axios.post(`${baseUrl}/summoner/basic`, {
        region: `${account.region === 'eune' ? 'eun1' : `${account.region}1`}`,
        summoner: account.name
    });

    if (res.status === 204) throw new Error('The account does not exist!');
    return res;
}

const getMatches = (account) => {
    return axios.post(`${baseUrl}/summoner/overview`, {
        accountId: account.accountId,
        puuid: account.puuid,
        region: `${account.region === 'eune' ? 'eun1' : `${account.region}1`}`,
    });

}

module.exports = {
    getAccount,
    getMatches
}