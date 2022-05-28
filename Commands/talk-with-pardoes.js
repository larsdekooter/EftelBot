const Command  = require('../Structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = new Command({
    name: 'speak-with-pardoes',
    data: new SlashCommandBuilder()
        .setName('speak-with-pardoes')
        .setDescription('Speak with Pardoes')
        .setNameLocalization('nl', 'praat-met-pardoes')
        .setDescriptionLocalization('nl', 'Praat met Pardoes')
        .addStringOption(o => o.setName('your-text').setDescription('What you want to talk about with pardoes').setNameLocalization('nl', 'jouw-tekst').setDescriptionLocalization('nl', 'Waarover je het wilt hebben met Pardoes').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.inCachedGuild()) return;

        const input = interaction.options.getString('your-text');
        const answers = [
            'Ik ben het daar niet mee eens.',
            'Ik weet niet echt hoe ik daar op moet reageren...',
            'Waarom zou je dat ooit doen?',
            'Natuurlijk!',
            'Waarom niet?',
            'Nee',
            'Eigenljk niet',    
        ];
        await interaction.reply(answers[Math.floor(Math.random() * answers.length)])
    }
})