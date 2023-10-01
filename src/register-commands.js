const { REST, Routes } = require('discord.js');
const settings = require('../settings.json');

const commands = [
    {
        name: 'check',
        description: 'Showing the level on every account.'
    }
];

const rest = new REST().setToken(settings.botToken);

function registerCommands() {
    rest.put(Routes.applicationGuildCommands(settings.CLIENT_ID, settings.GUILD_ID), {body: commands})
        .then(() => console.log('Commands were registered successfully!'))
        .catch(err => console.log(`An error occured while trying to register commands: ${err}`));
}

registerCommands();