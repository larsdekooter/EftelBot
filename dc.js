const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const clientId = '972464152176099372';
const guildId = '972418027066884116';
const token  = process.env['token']

const commands = [];
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    command.data ? commands.push(command.data.toJSON()) : null;
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
            .then(() => console.log('Reloaded / commands'))
    } catch (error) {
        console.error(error)
    }
})()