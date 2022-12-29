import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

// TODO: Upgrade code quality
export default {
	name: 'help',
	isInteraction: true,
	isCommand: true,
	description: 'Show Help Menu /(•_•)/',
	getSlashBuilder: function () {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description);
	},
	run: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const options = {
			commands: 
				'🚀 **Commands**:\n' +
				'**•** `/setchannel` `[text channel]` — set the specified text channel as the location where the bot will process messages that mention it.\n'+
				'**•** `/search` `[file attachment or image url]` — search for image source (in any channel).\n' +
				'\n' +
				'💬 **How do I use the bot?**\n' +
				'There are two ways to use the bot:\n' +
				'**1.** To have the bot\'s answers visible to everyone in a specified channel, set the bot\'s work channel using the /setchannel command and mention the bot with a link or image attachment.\n'+
				`\`Example:\` ${interaction.client.user} https://website.com/image.png\n`+
				'\n' +
				'**2.** To keep the bot\'s answers private, use the `/search` command with a URL or attachment as the parameter. The bot will send the result, that only you can see.' +
				'\n' +
				'\n`Click the buttons below to select options you need.`',
			// first: "** **",
			// Old instruction if yoy're selfhosting.
			// '**How do I set up the bot?**\n' +
			// '`There\'re just a few easy steps to set up the bot.`\n\n' +
			// '**1)** Choose text channel in which bot process every image.\n' +
			// '**2)** Connect bot to that channel using `/setchannel` command.\n' +
			// `**Example usage -> **\`/setchannel\` ${interaction.channel}\n` +
			// '**3)** Send any image into selected channel.',
			wrong_results: '**Why is my search result wrong?**\n\n' +
				'Actually idk, but I would recommend you to check this: [https://trace.moe/faq](https://trace.moe/faq)\n',
			need_help: '**There\'re problems using/setting the bot, what should I do?**\n\n' +
				'You\'re always welcome to our support server ♥️ - [https://discord.gg/TMxh6xz](https://discord.gg/TMxh6xz)\n',
		};

		const commandsBtn = new ButtonBuilder()
			.setCustomId('commands')
			.setLabel('Commands')
			.setStyle(ButtonStyle.Success);

		const wrongResultsBtn = new ButtonBuilder()
			.setCustomId('wrong_results')
			.setLabel('Why is my search result wrong?')
			.setStyle(ButtonStyle.Success);

		const needHelpBtn = new ButtonBuilder()
			.setCustomId('need_help')
			.setLabel('There\'re problems using/setting the bot, what should I do?')
			.setStyle(ButtonStyle.Success);

		const inviteBot = new ButtonBuilder()
			.setLabel('Invite Bot')
			.setURL('https://discord.com/oauth2/authorize?client_id=559247918280867848&scope=bot&permissions=52288')
			.setStyle(ButtonStyle.Link);

		const serverInvite = new ButtonBuilder()
			.setLabel('Support Server')
			.setURL('https://discord.gg/TMxh6xz')
			.setStyle(ButtonStyle.Link);


		const btnRows =
			[
				new ActionRowBuilder().addComponents([commandsBtn, wrongResultsBtn]),
				new ActionRowBuilder().addComponents([needHelpBtn]),
				new ActionRowBuilder().addComponents([inviteBot, serverInvite]),
			];

		try {
			const answer = await interaction.editReply({
				components: btnRows,
				embeds: [{
					title: '📓 Help Menu',
					color: 0x36393E,
					description: options.commands,
					// TODO: Update gif
					// image: {
					// 	url: 'https://cdn.discordapp.com/attachments/758209391731277829/841300623684665394/output.gif',
					// },
					footer: {
						text: 'Support: https://discord.gg/TMxh6xz',
						icon_url: interaction.member.user.avatarURL(),
					},
					timestamp: new Date().toISOString(),
				}],
				ephimeral: true,
			});

			const filter = (i) => i.user.id === interaction.user.id;

			const collector = answer.createMessageComponentCollector(filter, {
				time: 60000,
			});

			collector.on('collect', async btnInteraction => {
				const {data} = new EmbedBuilder(btnInteraction.message.embeds[0]);

				switch (btnInteraction.customId) {
					case ('commands'):
						data.description = options.commands;
						// embed.image = {
						// 	url: 'https://cdn.discordapp.com/attachments/758209391731277829/841300623684665394/output.gif',
						// };
						break;
					case ('wrong_results'):
						data.description = options.wrong_results;
						data.image = null;
						break;
					case ('need_help'):
						data.description = options.need_help;
						data.image = null;
						break;
				}

				btnInteraction.update({
					components: btnRows,
					embeds: [data],
				});
			});

			collector.on('end', () => {
				interaction.deferUpdate({
					embeds: [answer.embeds[0]],
				});
			});
		}
		catch (e) {
			console.log(e);
		}
	},
};