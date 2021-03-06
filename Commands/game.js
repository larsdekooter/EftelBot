const Command = require('../Structures/Command.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { log: l } = console;
// const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, Modal } = require('discord.js')
const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent, ButtonInteraction}  = require('discord.js')

module.exports = new Command({
    name: 'game',
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Play a game about Theme Parks in the Netherlands')
        .setNameLocalization('nl', 'spel')
        .setDescriptionLocalization('nl', 'Speel een spel over pretparken in Nederland')
        .addSubcommandGroup(com => 
            com
                .setName('efteling')
                .setDescription('Play games about the Efteling')
                .setDescriptionLocalization('nl', 'Speel spellen over de Efteling')
                .addSubcommand(sub => 
                    sub 
                        .setName('guess-attraction')
                        .setDescription('Guess what attraction is shown in the image')
                        .setNameLocalization('nl', 'raad-attractie')
                        .setDescriptionLocalization('nl', 'Raad welke attractie in de afbeelding staat')
                )
        )
        .addSubcommandGroup(group => {
            return group
                .setName('walibi')
                .setDescription('Play games about Walibi')
                .setDescriptionLocalization('nl', 'Speel spellen over Walibi')
                .addSubcommand(sub => {
                    return sub
                        .setName('guess-attraction')
                        .setDescription('Guess what attraction is shown in the image')
                        .setNameLocalization('nl', 'raad-attractie')
                        .setDescriptionLocalization('nl', 'Raad welke attractue is afgebeeld in de afbeelding')
                })
        })
      ,
    async execute(interaction, client) {
        if(!interaction.inCachedGuild()) return;
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();
        if(subcommandGroup === 'efteling') {
            if(subcommand === 'guess-attraction') {
                const images = [
                    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2I2-qv5_ec-JfpDcXizAbi_XwknbMWbpUEFKWdz_i&s', att: 'De Vliegende Hollander'},
                    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJUsTRZIul3Mr4dGwrVb4Me7HuWSkUrsA-WAV0f7oV1g&s', att: 'Symbolica'},
                    { image: 'https://www.efteling.com/nl/-/media/images/blog/backstage/20181008-onderhoud-vogel-rok/650x370-vogelrok.jpg?h=370&w=650&la=nl&hash=1A82E327597EAF381FCF92AEEF5739B4', att: 'Vogel Rok'},
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREN0z2XSt2bV7_SptL5n9Whi4AIKhQtxKlUoFKvyDF&s', att: 'Baron 1898' },
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUc2CNKrpgzUSyp7ixgOOfTxiK9IY6eCTGNhDsXi8a&s', att: 'Droomvlucht' },
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYJzW_ClJJBegzq3t_5S1NIgfKm5AJttKoXDXu1v9&s', att: 'Joris en de Draak' },
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi5DAQlMWUSXGprifSp1nQyaL9goghAh5hnuQdwleu&s', att: 'Python' },
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwHNufyyehZgVy2rWtT2eOxgYSooLFLLvdTzg9b6X&s', att: 'Fata Morgana' },
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDFKkCqcF0hwVcKZaLsiDsIQYwQbSq_HR9YJYSAcI5&s', att: 'Max & Moritz' },
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnn7Pay-9GVFmqmSJPKZ5PnLrKbyTKq_Jl0ctvIZthBw&s', att: 'Carnaval Festival' },
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlEJXpzkovA5U9g3rHIQUmGdaT23AfPn4QRfAXvu97tA&s', att: 'Villa Volta' },
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn7HNkoKqjacq6JyUb88RI6BZBmNckVYXZRjOgNAwKVQ&s', att: 'Pira??a' },
                  
                ].map(image => {
                    return { image: new MessageAttachment(image.image, 'eftelingimage.png'), att: image.att }
                })


                        // console.log(images.map(img => img.att))
                const attractionObject = images[Math.floor(Math.random() * images.length)];

                const message = await interaction.reply({ 
                    files: [attractionObject.image],
                    embeds: [
                        new MessageEmbed().setColor('DARK_GREEN').setTitle(client.translate(interaction.locale).attractionEmbedTitle).setImage('attachment://eftelingimage.png')
                    ],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setCustomId('showModal')
                                .setLabel(client.translate(interaction.locale).attractionButtonText)
                                .setStyle('SUCCESS')
                        )
                    ],
                    fetchReply: true
                });

                const filter = (i) => i.user.id === interaction.user.id;

                const collector = message.createMessageComponentCollector({ filter, time: 20000 });
                
                collector.on('collect', async function(button) {
                    collector.stop()
                    const modal = new Modal()
                        .setCustomId('eftelingAttractionGuess')
                        .setTitle(client.translate(interaction.locale).attractionModalTitle);

                    const attractionInput = new TextInputComponent()
                        .setCustomId('attractionInput')
                        .setLabel(client.translate(interaction.locale).attractionInputLabel)
                        .setStyle('SHORT')
                        .setRequired(true);

                    const actionRow = new MessageActionRow().addComponents(attractionInput);
                    modal.addComponents(actionRow);
                    await button.showModal(modal);
                    try {
                        await button.awaitModalSubmit({ filter, time: 30000 })
                        .then(modalSubmitInteraction => {
                            const row = modalSubmitInteraction.message.components[0];
                            const button = row.components[0];
                            button.setDisabled(true);
                            interaction.editReply({ components: [row] })
                            const value = modalSubmitInteraction.fields.getTextInputValue('attractionInput');
                            // console.log(value + '\n' + attractionObject.att.toLowerCase())
                            if(value.toLowerCase() == attractionObject.att.toLowerCase()) {
                                modalSubmitInteraction.reply({
                                    embeds: [
                                        new MessageEmbed().setColor('DARK_GREEN')
                                            .setTitle(client.translate(interaction.locale, attractionObject.att).attractionSuccessEmbedTitle)
                                    ],
                                    fetchReply: true
                                }).then(async msg =>{ 
                                        await msg.react('????');
                                    
                                })
                            } else {
                                modalSubmitInteraction.reply({
                                    embeds: [
                                        new MessageEmbed().setColor('DARK_GREEN')
                                            .setTitle(client.translate(interaction.locale, value, attractionObject.att).attractionWrongEmbedTitle)
                                    ]
                                })
                            }
                        }, async (rejected) => {
                            interaction.followUp(client.translate(interaction.locale).timeUp);
                            console.log('Rejected')
                        }).catch(e => {
                            console.log('Caught')
                            // console.error(e)
                            return interaction.followUp(client.translate(interaction.locale).timeUp)
                        })
                    } catch (error) {
                        // console.error(error)
                    }
                })
            }
        }
        if(subcommandGroup === 'walibi') {
            if(subcommand === 'guess-attraction') {
                const attractions = [
                    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS48bl60y5XG3t1p4Ylwe0oaAablKAWgesjNqgvKf22&s', name: 'Goliath' },
                    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyTdWbfO3JEPfQiAPaxGiF_F0xVXB53RCi-BNQPhgZWw&s', name: 'Lost Gravity' },
                    { img: 'https://www.looopings.nl/img/foto/061216verf1.jpg', name: 'Condor' },
                    { img: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Ch%C3%A2teau_magique_de_Merlin.JPG', name: 'Merlin\'s Magic Castle' },
                    { name: 'SkyDiver', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5IRkQvN3hkYobRNMfVz_bzZp5pETEZzReCixqacVx&usqp=CAE&s' }
                ].map(obj => { return { img: new MessageAttachment(obj.img, 'eftelingimage.png'), name: obj.name } });

                const attr = attractions[Math.floor(Math.random() * attractions.length)];

                await interaction.reply({
                    fetchReply: true,
                    files: [attr.img],
                    embeds: [
                        new MessageEmbed().setColor('RED').setTitle(client.translate(interaction.locale).attractionEmbedTitle).setImage('attachment://eftelingimage.png')
                    ],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel(client.translate(interaction.locale).attractionButtonText)
                                .setCustomId('submit')
                                .setStyle('SUCCESS')
                        )
                    ]
                });

                const message = await interaction.fetchReply()
                /**
                 * @type {ButtonInteraction}
                 */
                const buttonInteraction = await (message.partial ? await message.fetch() : message).awaitMessageComponent({ filter: (i) => i.user.id === interaction.user.id, time: 15000 });
                const modal = new Modal()
                    .setCustomId('walibiAttractionGuess')
                    .setTitle(client.translate(interaction.locale).attractionModalTitle);

                const attractionInput = new TextInputComponent()
                    .setCustomId('attractionInput')
                    .setLabel(client.translate(interaction.locale).attractionInputLabel)
                    .setStyle('SHORT')
                    .setRequired(true);
                modal.addComponents(new MessageActionRow().addComponents(attractionInput));
                await buttonInteraction.showModal(modal);

                try {
                    const modalInteraction = await buttonInteraction.awaitModalSubmit({ time: 30000 });
                    const row = modalInteraction.message.components[0];
                    const button = row.components[0];
                    button.setDisabled(true);
                    interaction.editReply({ components: [row] })
                    const input = modalInteraction.fields.getTextInputValue('attractionInput');
                    if(input.toLowerCase() === attr.name.toLowerCase()) return await modalInteraction.reply({ embeds: [ new MessageEmbed().setColor('RED').setTitle(client.translate(interaction.locale, input).attractionSuccesEmbedTitle) ], fetchReply: true }).then(async m => await m.react('????'));
                    else return await modalInteraction.reply({ embeds: [ new MessageEmbed().setColor('RED').setTitle(client.translate(interaction.locale, input, attr.name).attractionWrongEmbedTitle) ] })
                } catch(error) {
                    await interaction.followUp(client.translate(interaction.locale).timeUp)
                }

            }
        }
    }
});

function attraction(locale, extraText, rightInfo) {
    return {
        embedTitle: locale === 'nl' ? 'Welke attractie is afgebeeld in dit plaatje?' : 'What attraction is shown in this image?',
        modalTitle: locale === 'nl' ? 'Welke attractie denk je dat het is?' : 'Wich attraction do you think it is?',
        attractionInputLabel: locale === 'nl' ? 'Attractie' : 'Attraction',
        succesEmbedTitle: locale === 'nl' ? `Dat is inderdaad ${extraText}` : `That is indeed ${extraText}`,
        wronEmbedTitle: locale === 'nl' ? `${extraText} is helaas niet het goede antwoord. Het juiste antwoord was ${rightInfo}` : `${extraText} is onfortunatly not the right answer. The right answer was ${rightInfo}`,
        buttonText: locale === 'nl' ? 'Klik op mij om je antwoord in te voeren' : 'Press me to enter your answer',
        timeError: locale === 'nl' ? 'Tijd is op!' : 'You ran out of time!'
    }
}