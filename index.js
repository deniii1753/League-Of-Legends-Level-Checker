const { Client, IntentsBitField } = require('discord.js');

const { usableChannels, botToken, AdminRoleId } = require('./settings.json')
const { getAccounts, addAccount, removeAccount } = require('./src/accountsService.js');

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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (!usableChannels.includes(interaction.channelId)) return interaction.reply('❌ I\'m not allowed to send messages in this channel!');

    const command = interaction.commandName;

    try {
        await interaction.deferReply();

        if (command === 'check') {
            const region = interaction.options.get('region')?.value;
            const accounts = await getAccounts(region ? region.toUpperCase() : null);

            let message = '';

            accounts.forEach((account, i) => {
                if (!message.includes(account.region)) {
                    message += `\n----------= **${account.region}** =----------\n\n✅ ${account.level}\n`
                } else {
                    message += `✅ ${account.level}\n`
                }
            });

            return interaction.editReply(message);

        } else if (command === 'detailed_check') {
            const member = interaction.member;
            if (!(member.roles.cache.has(AdminRoleId))) return interaction.editReply('❌ You are not allowed to use this command!');

            const region = interaction.options.get('region')?.value;
            const accounts = await getAccounts(region ? region.toUpperCase() : null);

            let message = '';

            accounts.forEach((account, i) => {
                message += `---=Account ${i + 1}=---\nRegion: **${account.region}**\nName: **${account.name}**\nLevel: **${account.level}**\nLast Game: **${account.lastGame}**\n-------------------\n\n`;
            });

            return interaction.editReply(message);

        } else if (command === 'add_account') {
            const member = interaction.member;

            if (!(member.roles.cache.has(AdminRoleId))) return interaction.editReply('❌ You are not allowed to use this command!');

            const account = {
                name: interaction.options.get('name').value,
                region: interaction.options.get('region').value,
            }
            const addedAccount = await addAccount(account);

            return interaction.editReply(`Successfully saved **${addedAccount.name}** in **${(addedAccount.region).toUpperCase()}** in the list!`);

        } else if (command === 'remove_account') {
            const member = interaction.member;

            if (!(member.roles.cache.has(AdminRoleId))) return interaction.editReply('❌ You are not allowed to use this command!');

            const account = {
                name: interaction.options.get('name').value,
                region: interaction.options.get('region').value
            }
            const removedAccount = await removeAccount(account);

            return interaction.editReply(`Successfully removed **${removedAccount.name}** in **${(removedAccount.region).toUpperCase()}** from the list!`);

        } else {
            interaction.editReply('❌ Unknown command!');
        }
    } catch (err) {
        return interaction.editReply(`❌ ${err.message}`)
    }


})

client.login(botToken);

