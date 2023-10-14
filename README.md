# League-Of-Legends-Level-Checker

## Description 
This discord bot is based on [leaguestats.gg](https://leaguestats.gg/), you can add accounts in a list via command in discord server and follow their leveling progress.

## Usage

1. You have to create a bot in [Discord Developers Portal](https://discord.com/developers).
2. Link the bot with the app by filling the information in settings.json file.
3. Invite the bot to your server

## Commands

- `/add_account name`(required) `region`(required) - This command will add the account you want to the list. <br>**(Admin Permission Required)**
- `/remove_account name`(required) `region`(required) - This command will remove the account you want to the list. <br>**(Admin Permission Required)**
- `/check region`(optional) - This command will send you only what level the accounts are. If the region field is empty it will show all accounts in all region, if it's not it will filter the accounts by region. 
- `/detailed_check region`(optional) - This command will send detailed information about each account. If the region field is empty it will show all accounts in all region, if it's not it will filter the accounts by region. <br>**(Admin Permission Required)**
