const axios = require('axios');
const { Client, IntentsBitField } = require('discord.js');

const { mainChannelId, botToken } = require('./settings.json')
const { getAllAccounts, addAccount } = require('./src/accountsService.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.on('ready', (bot) => {
    console.log(`✅ ${bot.user.username} is online!`);
});

// client.on('messageCreate', (msg) => {
//     if(msg.author.bot) return;

//     if (msg.channelId !== mainChannelId) {
//         return msg.reply('❌ I\'m not allowed to send messages in this channel!');
//     }
//         console.log(msg.channelId);
// });

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.channelId !== mainChannelId) return interaction.reply('❌ I\'m not allowed to send messages in this channel!');

    const command = interaction.commandName;

    interaction.deferReply();

    if(command === 'check') {
        getAllAccounts()
            .then(res => {
                let message = '';
    
                res.forEach((account, i) => {
                    message+=`---=Account ${i+1}=---\nRegion: **${account.region}**\nName: **${account.name}**\nLevel: **${account.level}**\n-------------------\n\n`;
                });
    
                interaction.editReply(message);
            })
            .catch(err => console.log(`ERROR: ${err}`));

    } else if (command === 'add_account') {
        const account = {
            name: interaction.options.get('name').value,
            region: interaction.options.get('region').value
        } 
        addAccount(account) 
            .then(acc => interaction.editReply(`Successfully saved **${acc.name}** in **${(acc.region).toUpperCase()}** in the list!`))
            .catch(err => interaction.editReply(err.message))
    }

})

client.login(botToken);

