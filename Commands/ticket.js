const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, MessageActionRow, TextInputComponent, MessageEmbed, Message, MessageButton, Formatters, MessageFlags } = require('discord.js');
const { lazyrouter } = require('express/lib/application');
const Command = require('../Structures/Command');

module.exports = new Command({
    name: 'ticket',
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Report a bug or suggestion for EftelBot')
        .setDescriptionLocalization('nl', 'Rapporteer een bug of suggestie voor EftelBot')
        .addStringOption(o => {
            return o
                .setName('type')
                .setDescription('The type of ticket')
                .setDescriptionLocalization('nl', 'De type ticket')
                .addChoices({name: 'bug-report', value: 'bug-report'}, { name: 'suggestion', value: 'suggestion', name_localizations: { 'nl': 'suggestie' } })
                .setRequired(true)
        }),
    execute: async (interaction, client) => {
        if(!interaction.inCachedGuild()) return;
        const type = interaction.options.getString('type');

        if(type == 'bug-report') {
            // Create the Modal to show to the User
            const bugReportModal = new Modal()
                .setCustomId('bugreport')
                .setTitle('Bug Report Ticket')
                .addComponents(
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('title')
                            .setLabel('Bug Title')
                            .setRequired(true)
                            .setPlaceholder('Enter the title of your bug here')
                            .setStyle('SHORT'),
                    ),
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('report')
                            .setLabel('Report Description')
                            .setPlaceholder('Please enter your bug report here')
                            .setStyle('PARAGRAPH')
                            .setRequired(true)
                    )
                )
                // Show the Modal
            await interaction.showModal(bugReportModal)
            // Recieve the Modal Interaction
            const modal  = await interaction.awaitModalSubmit({ time: 30000 });

            // Get the inputs
            const bugTitle = modal.fields.getTextInputValue('title');
            const bugDescription = modal.fields.getTextInputValue('report');
            

            // Create the Bug Report embed
            const bugReportEmbed = new MessageEmbed()
                .setTitle(`Bug Report || ${bugTitle}`)
                .setDescription(Formatters.codeBlock(bugDescription))
                .setColor('RED')
                .setAuthor({ name: modal.user.username, iconURL: modal.user.displayAvatarURL() })
                .setTimestamp();

                
                // Confirm Message
                const message = await modal.reply({ 
                    embeds: [bugReportEmbed], 
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setCustomId('submit')
                                .setLabel('Submit')
                                .setStyle('SUCCESS')
                                ,
                            new MessageButton()
                                .setCustomId('cancel')
                                .setStyle('DANGER')
                                .setLabel('Cancel')
                        )
                    ],
                    content: 'Is this right?',
                    fetchReply: true,
                    ephemeral: true,
                });


                //Button Interaction
                const button = await message.awaitMessageComponent({ filter: (i) => i.user.id === modal.user.id, time: 15000,  });

                // Update the Buttons on the message so they are disabled
                const row = button.message.components[0]
                const buttonMessageButtons = row.components;
                buttonMessageButtons.forEach(button => button.setDisabled(true));
                await button.update({ components: [row] })

                // Submit ticket. End Creation
                if(button.customId === 'submit') {
                    await button.followUp({ embeds: [new MessageEmbed().setTitle('Successfully send the bug report')] });
                    const channel = client.channels.cache.get('980168750693236818')
                    if(!channel.isText()) return;
                    channel.send({ embeds: [bugReportEmbed] });
                }
                // Cancel ticket. End creation
                else {
                    await modal.followUp({content: 'Cancelled ticket creation. If you want to start again, enter the command `/ticket` again!', ephemeral: true});
                }
        }
        if(type == 'suggestion') {
            // Create the Modal for the user
            const suggestionModal = new Modal()
                .setCustomId('suggestion')
                .setTitle('Suggestion Ticket')
                .addComponents(
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('title')
                            .setLabel('Title')
                            .setPlaceholder('Enter the title of your suggestion')
                            .setStyle('SHORT')
                            .setRequired(true)
                    ),
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('description')
                            .setLabel('Description')
                            .setPlaceholder('Enter the description of your suggestion')
                            .setStyle('PARAGRAPH')
                            .setRequired(true)
                    )
                )
            
            // Show the Modal to the User
            await interaction.showModal(suggestionModal)
            
            // Get the ModalSubmitInteraction
            const modal = await interaction.awaitModalSubmit({ time: 30000 });
            //Get the modal inputs
            const { fields } = modal;
            const [title, description,] = [fields.getTextInputValue('title'), fields.getTextInputValue('description'), ];
            // Suggestion Embed
            const suggestionEmbed = new MessageEmbed()
                .setTitle(`Suggestion || ${title}`)
                .setAuthor({ name: modal.user.username, iconURL: modal.user.displayAvatarURL() })
                .setDescription(`${Formatters.codeBlock(description)}`)
                .setColor('RED')
                .setTimestamp();

            // Send Buttons and embed
            const message = await modal.reply({
                embeds: [suggestionEmbed],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('submit')
                                .setLabel('Submit')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('cancel')
                                .setLabel('Cancel')
                                .setStyle('DANGER')
                        )
                ],
                fetchReply: true,
                ephemeral: true
            });

            const button = await message.awaitMessageComponent({ time: 15000 });
            const row = button.message.components[0];
            row.components.forEach(bn => bn.setDisabled(true))
            await button.update({ components: [row] });
            if(button.customId == 'submit') {
                const channel = client.channels.cache.get('980168783312330784');
                if(!channel.isText()) return;
                channel.send({ embeds: [suggestionEmbed] })
                await button.followUp({ embeds: [new MessageEmbed().setTitle('Succesfully send Suggestion')] })
            } else {
                await button.followUp({ ephemeral: true, content: 'Cancelled Suggestion Ticket. Run `/ticket` again to retry!' })
            }
        }
    }
})