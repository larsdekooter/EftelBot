const Command  = require('../Structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const { join } = require('path');

module.exports = new Command({
    name: 'voice',
    data: new SlashCommandBuilder()
        .setName('voice')
        .setDescription('Interact with the bot in Voice')
        .setDescriptionLocalization('nl', 'Interageer met de bot in Voice')
        .addSubcommand(s => {
            return s
                .setName('carnaval-festival')
                .setDescription('Play Carnaval Festival in Voice!')
                .setDescriptionLocalization('nl', 'Speel Carnaval Festival in Voice')
        })
        ,
    async execute(interaction, client) {
        if(!interaction.inCachedGuild()) return;
        const memberVoiceChannel  = interaction.member.voice.channelId;
        if(!memberVoiceChannel) return await interaction.reply({ content: 'Please join a voice channel before executing this command!', ephemeral: true });
        const connection  = joinVoiceChannel({
            channelId: memberVoiceChannel,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        await interaction.reply('Succesfully joined channel. Starting to play')

        const subcommand = interaction.options.getSubcommand();

        let resource;

        if(subcommand === 'carnaval-festival') resource = createAudioResource('carnaval-festival.mp3');
        if(subcommand === 'harem') resource = createAudioResource('')
        
        const player = createAudioPlayer();
        player.play(resource);
        connection.subscribe(player)
    }
})