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
                  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn7HNkoKqjacq6JyUb88RI6BZBmNckVYXZRjOgNAwKVQ&s', att: 'Piraña' },
                  
                ].map(image => {
                    return { image: new MessageAttachment(image.image, 'eftelingimage.png'), att: image.att }
                })


                        // console.log(images.map(img => img.att))
                const attractionObject = images[Math.floor(Math.random() * images.length)];

                const message = await interaction.reply({ 
                    files: [attractionObject.image],
                    embeds: [
                        new MessageEmbed().setColor('DARK_GREEN').setTitle(attraction(interaction.locale).embedTitle).setImage('attachment://eftelingimage.png')
                    ],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setCustomId('showModal')
                                .setLabel(attraction(interaction.locale).buttonText)
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
                        .setTitle(attraction(interaction.locale).modalTitle);

                    const attractionInput = new TextInputComponent()
                        .setCustomId('attractionInput')
                        .setLabel(attraction(interaction.locale).attractionInputLabel)
                        .setStyle('SHORT')
                        .setRequired(true);

                    const actionRow = new MessageActionRow().addComponents(attractionInput);
                    modal.addComponents(actionRow);
                    await button.showModal(modal);
                    await button.awaitModalSubmit({ filter, time: 30000 }).then(modalSubmitInteraction => {
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
                                        .setTitle(attraction(interaction.locale, attractionObject.att).succesEmbedTitle)
                                ],
                                fetchReply: true
                            }).then(async msg =>{ 
                                    await msg.react('👍');
                                    
                            })
                        } else {
                            modalSubmitInteraction.reply({
                                embeds: [
                                    new MessageEmbed().setColor('DARK_GREEN')
                                        .setTitle(attraction(interaction.locale, value, attractionObject.att).wronEmbedTitle)
                                ]
                            })
                        }
                    })
                })
            }
        }
        if(subcommandGroup === 'walibi') {
            if(subcommand === 'guess-attraction') {
                const attractions = [
                    { img: 'https://cdn.discordapp.com/attachments/950681875733708820/979677026174763018/unknown.png', name: 'test' }
                ].map(obj => { return { img: new MessageAttachment(obj.img, 'eftelingimage.png'), name: obj.name } });

                const attr = attractions[Math.floor(Math.random() * attractions.length)];

                await interaction.reply({
                    fetchReply: true,
                    files: [attr.img],
                    embeds: [
                        new MessageEmbed().setColor('RED').setTitle(attraction(interaction.locale).embedTitle).setImage('attachment://eftelingimage.png')
                    ],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel(attraction(interaction.locale).buttonText)
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
                    .setTitle(attraction(interaction.locale).modalTitle);

                const attractionInput = new TextInputComponent()
                    .setCustomId('attractionInput')
                    .setLabel(attraction(interaction.locale).attractionInputLabel)
                    .setStyle('SHORT')
                    .setRequired(true);
                modal.addComponents(new MessageActionRow().addComponents(attractionInput));
                await buttonInteraction.showModal(modal);

                const modalInteraction = await buttonInteraction.awaitModalSubmit({ time: 20000 });
                const row = modalInteraction.message.components[0];
                const button = row.components[0];
                button.setDisabled(true);
                interaction.editReply({ components: [row] })
                const input = modalInteraction.fields.getTextInputValue('attractionInput');
                if(input.toLowerCase() === attr.name.toLowerCase()) return await modalInteraction.reply({ embeds: [ new MessageEmbed().setColor('RED').setTitle(attraction(interaction.locale, input).succesEmbedTitle) ], fetchReply: true }).then(async m => await m.react('👍'));
                else return await modalInteraction.reply({ embeds: [ new MessageEmbed().setColor('RED').setTitle(attraction(interaction.locale, input, attr.name).wronEmbedTitle) ] })

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
        buttonText: locale === 'nl' ? 'Klik op mij om je antwoord in te voeren' : 'Press me to enter your answer'
    }
}