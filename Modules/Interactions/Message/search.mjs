import { MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import SearchEngine from '../../SearchEngines/searchEngine.mjs';
const urlCheckRegExp = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif)/i;

export default {
	name: 'search',
	description: 'Provide an image URL with this command to look for it\'s source',
	getSlashBuilder: function() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addStringOption(opt => opt.setName('image')
				.setDescription('The image you are looking for the source of \\o/')
				.setRequired(true),
			);
	},
	getContextBuilder: function() {
		return new ContextMenuCommandBuilder()
			.setName(this.name)
			.setType(3);
	},
	run: async (interaction) => {
		const message = interaction.options.getMessage('message');
		const imageURL = interaction.options.getString('image')
			|| message?.attachments?.first?.()?.url
			|| message.content.match(urlCheckRegExp)?.shift();

		if (!imageURL) return interaction.reply({ content: 'Image not found!', ephemeral: true });

		await interaction.deferReply({ ephemeral: true });

		try {
			const searchEngine = new SearchEngine();
			const results = await searchEngine.search(imageURL);
			if (results.isEmpty) return new Error('No results');

			const answer = await interaction.editReply({
				embeds: [results.current.toEmbed(interaction, results)],
				components: formMsgComponents(false),
				ephemeral: true,
			});

			const filter = (i) => i.user.id === interaction.user.id;
			const collector = answer.createMessageComponentCollector({ filter, time: 120000 });

			collector.on('collect', async (btnInteraction) => {
				if (btnInteraction.customId == 'down') results.next();
				if (btnInteraction.customId == 'up') results.previous();

				btnInteraction.update({
					embeds: [results.current.toEmbed(interaction, results)],
					components: formMsgComponents(false),
					ephemeral: true,
				});
			});

			collector.on('end', () => {
				interaction.editReply({
					embeds: [results.current.toEmbed(interaction, results)],
					components: formMsgComponents(true),
					ephemeral: true,
				});
			});
		}
		catch (e) {
			console.error('[Search Interaction] ' + e);
			return interaction.editReply({
				content: 'An error occurred while searching (╯°□°)╯︵ ┻━┻',
				ephemeral: true,
			});
		}

	},
};

const formMsgComponents = (isDisabled = false) => {
	const prevBtn = new MessageButton()
		.setCustomId('up')
		.setLabel('Up')
		.setStyle('SUCCESS')
		.setEmoji('⬆️')
		.setDisabled(isDisabled);

	const nextBtn = new MessageButton()
		.setCustomId('down')
		.setLabel('Down')
		.setStyle('SUCCESS')
		.setEmoji('⬇️')
		.setDisabled(isDisabled);

	const inviteBtn = new MessageButton()
		.setLabel('Invite Bot')
		.setURL('https://discord.com/oauth2/authorize?client_id=559247918280867848&scope=bot&permissions=52288')
		.setStyle('LINK');

	const buttonRow = new MessageActionRow()
		.addComponents(prevBtn, nextBtn, inviteBtn);

	return [buttonRow];
};