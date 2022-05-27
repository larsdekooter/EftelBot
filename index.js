console.clear()

const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10')
const { FLAGS } = Intents;
const fs = require('node:fs');
const express = require('express');
require('dotenv').config()
const token = process.env['token'];

const app = express();
app.get('/', (req, res) => res.sendFile('index.html', { root: '.' }))
app.get('/botcommands.html', (req, res) => res.sendFile('botcommands.html', { root: '.' }))
app.get('/releases.html', (req, res) => res.sendFile('releases.html', { root: '.' }))
app.get('/serverinfo.html', (req, res) => res.sendFile('serverinfo.html', { root: '.' }))
app.get('/themeparks', async (req, res) => {
 const rest = new REST({ version: '9' }).setToken(token);
rest.get(Routes.guild('972418027066884116'), {
  // query: makeURLSearchParams({ with_counts: true })
}).then(guild => { res.status(200).send(JSON.parse(JSON.stringify(guild))); })
})
app.use(express.static('public'))
app.listen(8080)

const client = new Client({
    intents: [
        FLAGS.GUILDS,
        // FLAGS.GUILD_MESSAGES,
        // FLAGS.GUILD_SCHEDULED_EVENTS,
    ],
  presence: {
    activities: [{ name: 'De wacht op de opening van de Pagode', type: 'WATCHING' }]
    
  }
});

client.on('ready', async () => {
    console.log(`${client.user.tag} is online`)
     
});

client.on('debug', console.log)

client.commands = new Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./Commands/${file}`);

    client.commands.set(command.name, command)
}

client.on('interactionCreate', async (interaction) => {
    if(interaction.isCommand()) {
        const { commandName } = interaction
        const command = client.commands.get(commandName);
        if(!command) return console.log('STOP');
        command.execute(interaction, client)
    }
})



  setInterval(async() => {
    const rest = new REST({ version: '10' }).setToken(token);
  await rest.post(Routes.channelMessages('979437918651306015'), {
    body: {
      content: 'Bot Online'
    }
  })
  }, 43200000)


client.login(token)
