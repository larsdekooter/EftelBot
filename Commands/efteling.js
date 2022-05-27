const Command = require('../Structures/Command.js');
const { default: fetch } = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { log: l } = console

module.exports = new Command({
    name: 'efteling',
    data: new SlashCommandBuilder()
        .setName('efteling')
        .setDescription('Get Information from the efteling')
        .setDescriptionLocalization('nl', 'Krijg Informatie uit de efteling!')
        .addSubcommand(s => 
            s.setName('attractions')
            .setNameLocalization('nl', 'attracties')
            .setDescription('Get Attractions from the Efteling')
            .setDescriptionLocalization('nl', 'Krijg informatie over attracties uit de Efteling')
            .addStringOption(o => 
                o
                    .setName('attraction')
                    .setNameLocalization('nl', 'attractie')
                    .setDescription('The Attraction to search for')
                    .setDescriptionLocalization('nl', 'De Attractie die je wilt vinden')
                    .setRequired(true)
            ) 
        )
        .addSubcommand(s => 
            s
                .setName('maintenance')
                .setNameLocalization('nl', 'onderhoud')
                .setDescription('Get Maintenance Information In the Efteling')    
                .setDescriptionLocalization('nl', 'Krijg Onderhoud Informatie uit de Efteling')
        )
        .addSubcommand(s =>
            s
                .setName('park-information')
                .setNameLocalization('nl', 'park-informatie')
                .setDescription('Get the Openings Times and how busy it is')
                .setDescriptionLocalization('nl', 'Krijg de Openings Tijden en hoe druk het is')
        )
        .addSubcommand(s => 
            s
                .setName('queue-times')
                .setDescription('Queue Times for rides in the Efteling')
                .setNameLocalization('nl', 'wachttijden')
                .setDescriptionLocalization('nl', 'Wacthtijden voor ritten in de Efteling')
                .addStringOption(o => 
                    o
                        .setName('lands')
                        .setNameLocalization('nl', 'rijken')
                        .setDescription('See the Queue times for a specific land')
                        .setDescriptionLocalization('nl', 'Zie de Wachttijden voor specifike rijken')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Anderrijk', value: 'Anderrijk',  },
                            { name: 'Efteling Village Bosrijk', value: 'Efteling Village Bosrijk' },
                            { name: 'Fantasierijk', value: 'Fantasierijk' },
                            { name: 'Marerijk', value: 'Marerijk' },
                            { name: 'Reizenrijk', value: 'Reizenrijk' },
                            { name: 'Ruigrijk', value: 'Ruigrijk' }
                        )    
                )    
        ),
    async execute(interaction, client) {
        if(interaction.options.getSubcommand() === 'attractions') {
            const response = await fetch('https://eftelingapi.herokuapp.com/attractions');

        const { AttractionInfo } = await response.json();
        
        const option = interaction.options.getString('attraction');
        const attractions = AttractionInfo.filter(att => att.Id.includes(option)).map(att => att.Id);
        if(interaction.locale !== 'nl') {
            const embed = new MessageEmbed()
            .setTitle(`Your Search Result of ${option}`)
            .setDescription('If your hoped search result wasn\'t in here, try again with different words')
            .setColor('DARK_GREEN')

            if(attractions.length > 0 && attractions.length < 25) {
            attractions.forEach(att => {
                embed.addField(att, '\u200b')
            })
            }
            if(attractions.length == 0) {
                embed.addField('Couldn\'t find anything!')
            }
            if(attractions.length > 25) {
                for(let i = 0; i < 24; i++) {
                    const att = attractions[i];
                    embed.addField(att, '\u200b')
                }
            }
            await interaction.reply({ embeds: [embed] })
        }
        if(interaction.locale === 'nl') {
            const embed = new MessageEmbed()
            .setTitle(`Jouw zoekresultaat voor:  ${option}`)
            .setDescription('Als je een ander zoekresultaat had verwacht, probeer het opnieuw maar dan anders verwoord')
            .setColor('DARK_GREEN')

            if(attractions.length > 0 && attractions.length < 25) {
                attractions.forEach(att => {
                    embed.addField(att, '\u200b')
                })
            }
            if(attractions.length == 0) {
                embed.addField('Kon niks gevonden krijgen!')
            }
            if(attractions.length > 25) {
                for(let i = 0; i < 24; i++) {
                    const att = attractions[i];
                    embed.addField(att, '\u200b')
                }
            }
            await interaction.reply({ embeds: [embed] })
        }
        }
        if(interaction.options.getSubcommand() === 'maintenance') {
            const response = await fetch('https://eftelingapi.herokuapp.com/maintenance');
            const { MaintenanceInfo } = await response.json();
            let embed = new MessageEmbed()
            if(interaction.locale !== 'nl') {
                embed
                .setTitle('Maintenances')
                .setDescription('All the current maintenances in the Efteling')
                .setColor('DARK_GREEN')

                if(MaintenanceInfo.length > 0 && MaintenanceInfo.length < 25) {
                    MaintenanceInfo.forEach(m => {
                        embed.addField(m.AttractionId.replace(/(^\w|\s\w)/g, m => m.toUpperCase()), `**From**: ${m.DateFrom}\n**To**: ${m.DateTo}\n**Opened In Weekends**: ${m.OpenInWeekend == true ? 'Yes' : 'No'}`)
                    })
                }
                if(MaintenanceInfo.length == 0) {
                    embed.addField('No Maintenances at the moment 😁')
                }
                if(MaintenanceInfo.length > 24) {
                    for(let i = 0; i < 25; i++) {
                        const m = MaintenanceInfo[i];
                        embed.addField(m.AttractionId.replace(/(^\w|\s\w)/g, m => m.toUpperCase()), `**From**: ${m.DateFrom}\n**To**: ${m.DateTo}\n**Opened In Weekends**: ${m.OpenInWeekend == true ? 'Yes' : 'No'}`)
                    }
                }
            }
            if(interaction.locale === 'nl') {
                embed
                .setTitle('Onderhoud')
                .setDescription('Alle onderhouden in de Efteling')
                .setColor('DARK_GREEN')

                if(MaintenanceInfo.length > 0 && MaintenanceInfo.length < 25) {
                    MaintenanceInfo.forEach(m => {
                        embed.addField(m.AttractionId.replace(/(^\w|\s\w)/g, m => m.toUpperCase()), `**Vanaf**: ${m.DateFrom}\n**Tot**: ${m.DateTo}\n**Open In Weekenden**: ${m.OpenInWeekend == true ? 'Ja' : 'Nee'}`)
                    })
                }
                if(MaintenanceInfo.length == 0) {
                    embed.addField('Geen onderhouden op het moment😁')
                }
                if(MaintenanceInfo.length > 24) {
                    for(let i = 0; i < 25; i++) {
                        const m = MaintenanceInfo[i];
                        embed.addField(m.AttractionId.replace(/(^\w|\s\w)/g, m => m.toUpperCase()), `**Vanaf**: ${m.DateFrom}\n**Tot**: ${m.DateTo}\n**Open In Weekenden**: ${m.OpenInWeekend == true ? 'Ja' : 'Nee'}`)
                    }
                }
            }
            await interaction.reply({ embeds: [embed] })
        }
        if(interaction.options.getSubcommand() === 'park-information') {
            const embed = new MessageEmbed()
            .setColor('DARK_GREEN');
            const response = await fetch('https://eftelingapi.herokuapp.com/metadata');
            const parkInfo = await response.json();
            if(interaction.locale !== 'nl') {
                embed.setDescription('Efteling Information')
                .addFields(
                    { name: 'Openings Times', value: parkInfo.OpeningHours.HourFrom.slice('2022-05-08T'.length) + ' - ' + parkInfo.OpeningHours.HourTo.slice('2022-05-08T'.length) },
                    { name: 'Busy Indication', value: translateBusyIndication(parkInfo.OpeningHours.BusyIndication) }
                )
            }
            if(interaction.locale === 'nl') {
                embed.setDescription('Efteling Informatie')
                .addFields(
                    { name: 'Openings Tijden', value: parkInfo.OpeningHours.HourFrom.slice('2022-05-08T'.length) + ' - ' + parkInfo.OpeningHours.HourTo.slice('2022-05-08T'.length) },
                    { name: 'Drukte Indicatie', value: parkInfo.OpeningHours.BusyIndication.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) }
                )
            }
            await interaction.reply({ embeds: [embed] })
        }
        if(interaction.options.getSubcommand() === 'queue-times') {
            const embed = new MessageEmbed()
            .setColor('DARK_GREEN');
            
            const response = await fetch('https://queue-times.com/nl/parks/160/queue_times.json')  
            const queuTimes = await response.json();
            const { lands } = queuTimes;
            const rijk = lands.find(land => land.name === interaction.options.getString('lands'))
            const { rides } = rijk;

            if(interaction.locale == 'nl') {
                embed.setAuthor({ url: 'https://queue-times.com/nl', name: 'Mogelijk gemaakt door Queue-Times.com' })
                rides.filter(ride => ride.is_open == true).forEach(ride => {
                    embed.addField(ride.name, `**Wacht Tijd**: ${ride.wait_time} minuten`)
                })
            }

            if(interaction.locale !== 'nl') {
                embed.setAuthor({ url: 'https://queue-times.com/nl', name: 'Powered by Queue-Times.com' })
                rides.filter(ride => ride.is_open == true).forEach(ride => embed.addField(ride.name, `**Wait Time**: ${ride.wait_time} minutes`))
            }

            await interaction.reply({ embeds: [embed] })
        }
    }
})

/**
 * 
 * @param {string} BusyIndication 
 */
function translateBusyIndication(BusyIndication) {
    let busyness = ''
    if(BusyIndication == 'druk' ) busyness = 'busy'
    else busyness = BusyIndication;
    return busyness.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
}