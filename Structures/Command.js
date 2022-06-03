const { Message, Client, CommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const MyClient = require("./Client");

/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Client} client 
 */
function RunFunction(message, args, client) {};
/**
 * 
 * @param {CommandInteraction} interaction 
 * @param {MyClient} client 
 */
function RunInteraction(interaction, client) {};

class Command {
    /**
     * @typedef {{ name: string, run: RunFunction, data: SlashCommandBuilder, execute: RunInteraction}} CommandOptions
     * @param {CommandOptions} options
     */
    constructor(options) {
        this.name = options.name;
        this.data = options.data;
        this.execute = options.execute;
        this.run = options.run;
    }
}

module.exports = Command;