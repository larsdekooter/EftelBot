console.clear()
// Import everything we use
const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10')
const { FLAGS } = Intents;
const fs = require('node:fs');
require('dotenv').config();
// Setup our website
const express = require('express');
const app = express();
app.get('/', (req, res) => res.sendFile('index.html', { root: '.' }));
app.get('/botcommands.html', (req, res) => res.sendFile('botcommands.html', { root: '.' }));
app.get('/releases.html', (req, res) => res.sendFile('releases.html', { root: '.' }));
app.get('/serverinfo.html', (req, res) => res.sendFile('serverinfo.html', { root: '.' }))
app.get('/themeparks', async (req, res) => {
  const rest = new REST({ version: '9' }).setToken(token);
  rest.get(Routes.guild('972418027066884116')).then(guild => { res.status(200).send(JSON.parse(JSON.stringify(guild))); })
});
app.use(express.static('public'));
app.listen(8080)

const token = process.env['token'];

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

    client.commands.set(command.data.name, command)
}

client.on('interactionCreate', async (interaction) => {
    if(interaction.isCommand()) {
        const { commandName } = interaction
        const command = client.commands.get(commandName);
        if(!command) return console.log('STOP');
        try {
          await command.execute(interaction, client)
        } catch (error) {
          console.error(error)
          return await interaction.reply('Oops.... Something went wrong').catch(e => {
            if(e.message == 'DiscordAPIError: Interaction has already been acknowledged') return interaction.channel.send('Oops.... Something went wrong!')
            console.log(e)
          })
        }
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


// client.login(token)
console.log(process.argv.slice(2))
client.on('rateLimit', console.log)
process.argv.slice(2)[0] === 'n' ? null : client.login(token)