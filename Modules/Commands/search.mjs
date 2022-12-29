import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import SearchEngine from '../SearchEngines/searchEngine.mjs';
const urlCheckRegExp = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif)/i;

export default {
	run: async (message, db) => {
		const imageURL = message.attachments?.first?.()?.url ?? message.content.match(urlCheckRegExp)[0];

		if (imageURL) {
			await message.channel.sendTyping();

			try {
				const searchEngine = new SearchEngine();
				const results = await searchEngine.search(imageURL);
				if (results.isEmpty) return new Error('No results');

				const answer = await message.channel.send({
					embeds: [results.current.toEmbed(message, results)],
					components: formMsgComponents(false),
				});

				const filter = (i) => i.user.id === message.author.id;
				const collector = answer.createMessageComponentCollector({ filter, time: 120000 });

				collector.on('collect', async btnInteraction => {
					if (btnInteraction.customId == 'down') results.next();
					if (btnInteraction.customId == 'up') results.previous();

					btnInteraction.update({
						embeds: [results.current.toEmbed(message, results)],
						components: formMsgComponents(false),
					});
				});

				collector.on('end', () => {
					answer.edit({
						embeds: [results.current.toEmbed(message, results)],
						components: formMsgComponents(true),
					});
				});
			}
			catch (e) {
				console.error('[Search CMD] ' + e);
				return message.channel.send({
					content: 'An error occurred while searching (╯°□°)╯︵ ┻━┻'
				});
			}
		}
	},
};

const formMsgComponents = (isDisabled = false) => {
	const prevBtn = new ButtonBuilder()
		.setCustomId('up')
		.setLabel('Up')
		.setStyle(ButtonStyle.Success)
		.setEmoji('⬆️')
		.setDisabled(isDisabled);

	const nextBtn = new ButtonBuilder()
		.setCustomId('down')
		.setLabel('Down')
		.setStyle(ButtonStyle.Success)
		.setEmoji('⬇️')
		.setDisabled(isDisabled);

	const inviteBtn = new ButtonBuilder()
		.setLabel('Invite Bot')
		.setURL('https://discord.com/oauth2/authorize?client_id=559247918280867848&scope=bot&permissions=52288')
		.setStyle(ButtonStyle.Link);

	const donateBtn = new ButtonBuilder()
		.setLabel('Support Creator')
		.setEmoji('❤️')
		.setURL('https://boosty.to/wnm')
		.setStyle(ButtonStyle.Link);

	const controlsRow = new ActionRowBuilder()
		.addComponents(prevBtn, nextBtn)
	const utilsRow = new ActionRowBuilder()
		.addComponents(donateBtn, inviteBtn);


	return [utilsRow, controlsRow];
};