const axios = require('axios');
const { Client, IntentsBitField } = require('discord.js');

const accounts = require('./accounts.json');
const { addAccount, getAccountDetails, removeAccount } = require('./src/accountsService.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})
async function start() {
    for (const account of accounts) {
        try {
            await axios.post(`https://op.gg/api/v1.0/internal/bypass/summoners/${account.region}/${account.summonerId}/renewal`);
            const checkedAccount = await getAccountDetails(account);

            if (!checkedAccount.name) continue;

            console.log(checkedAccount);

        } catch (err) {
            console.log(err.message);
        }
    }
}

client.on('ready', (bot) => {
    console.log(`✅ ${bot.user.username} is online!`);
})



