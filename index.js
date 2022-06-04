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
const MyClient = require('./Structures/Client');
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


// Get the token to login with from the .env file
const token = process.env['token'];

// Create the client, MyClient just has an extra method attached to it and extend the Client from discord.js

const client = new MyClient({
  // The intents for the events
    intents: [
        FLAGS.GUILDS,
      ],

      // Set the presence of the bot
      presence: {
        activities: [{ name: 'De wacht op de opening van de Pagode', type: 'WATCHING' }]
        
      }
    });
    

    // Once the client is logged in and recieved everything it needs, log to the console that the bot is online
client.on('ready', async () => {
  console.log(`${client.user.tag} is online`);    
});

// Log info to the console, important because if the bot is ratelimited the console will show it
client.on('debug', console.log)
  
// Put all the commands a Collection, needed for the Command Handler
client.commands = new Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./Commands/${file}`);

    client.commands.set(command.data.name, command)
}

// Once we recieve an interaction, the command will be found and ran
client.on('interactionCreate', async (interaction) => {
  // Check if interaction is a command, and not any other interaction such as a button
  if(interaction.isCommand()) {
    const { commandName } = interaction;
    // Get the command from the Collection
    const command = client.commands.get(commandName);
    // If no command is found, stop the interaction
    if(!command) return console.log('STOP');
    try {
      // Try to execute the command
      await command.execute(interaction, client);
    } catch (error) {
      // Log the error to the console
      console.error(error)      
      // If there is an error and the interaction is already acknowledged, send a message to the channel. If the bot doesnt have any SEND_MESSAGES and VIEW_CHANNEL permission in
      // that channel, catch the MISSIN_PERMISSIONS error
      if(interaction.deferred || interaction.replied) return interaction.channel.send('Oops... Something went wrong! (code: ALREADY_REPLIED)').catch(e => {});
      // Reply to the interaction that something went wrong
      return await interaction.reply('Oops.... Something went wrong! (code: UNKNOWN)')
    }
  }
})


// If the bot hits a ratelimit, it will be logged to the console
client.on('rateLimit', console.log);

// If the second argument in the console is 'n', dont login and only run the site. If it isnt 'n', login
process.argv.slice(2)[0] === 'n' ? null : client.login(token)