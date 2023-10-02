const { REST, Routes } = require('discord.js');
const settings = require('../settings.json');

const commands = [
    {
        name: 'check',
        description: 'Showing the level on every account.'
    },
    {
        name: 'add_account',
        description: 'Adding account to the checking list.',
        options: [
            {
                name: 'name',
                description: 'Your account\'s in game name here.',
                type: 3,
                required: true
            },
            {
                name: 'region',
                description: 'Your account\'s region here.',
                type: 3,
                required: true,
                choices: [
                    {
                        name: 'euw',
                        value: 'EUW'
                    },
                    {
                        name: 'eune',
                        value: 'EUNE'
                    },
                    {
                        name: 'na',
                        value: 'NA'
                    }
                ]
            }
        ]
    },
    {
        name: 'remove_account',
        description: 'Removes an account from the list.',
        options: [
            {
                name: 'name',
                description: 'Account in game name here.',
                type: 3,
                required: true
            },
            {
                name: 'region',
                description: 'Account region here.',
                type: 3,
                required: true,
                choices: [
                    {
                        name: 'euw',
                        value: 'EUW'
                    },
                    {
                        name: 'eune',
                        value: 'EUNE'
                    },
                    {
                        name: 'na',
                        value: 'NA'
                    }
                ]
            }
        ]
    }
];

const rest = new REST().setToken(settings.botToken);

function registerCommands() {
    rest.put(Routes.applicationGuildCommands(settings.CLIENT_ID, settings.GUILD_ID), { body: commands })
        .then(() => console.log('Commands were registered successfully!'))
        .catch(err => console.log(`An error occured while trying to register commands: ${err}`));
}

registerCommands();