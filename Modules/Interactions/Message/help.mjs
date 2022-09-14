import { MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

// TODO: Upgrade code quality
export default {
	name: 'help',
	isInteraction: true,
	isCommand: true,
	description: 'Show Help Menu /(•_•)/',
	getSlashBuilder: function() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description);
	},
	run: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const options = {
			first: '**Commands**\n\n' +
				'**`/search`** `file attachment or image url` - search for image source.\n' +
				// '**`/setchannel`** - Set channel in which bot will be triggered on every image.\n\n' +
				'\n`Click the buttons below to select options you need.`',
			// first: "** **",
			// Old instruction if yoy're selfhosting.
			// '**How do I set up the bot?**\n' +
			// '`There\'re just a few easy steps to set up the bot.`\n\n' +
			// '**1)** Choose text channel in which bot process every image.\n' +
			// '**2)** Connect bot to that channel using `/setchannel` command.\n' +
			// `**Example usage -> **\`/setchannel\` ${interaction.channel}\n` +
			// '**3)** Send any image into selected channel.',
			second: '**Why is my search result wrong?**\n\n' +
				'Actually idk, but I would recommend you to check this: [https://trace.moe/faq](https://trace.moe/faq)\n',
			third: '**There\'re problems using/setting the bot, what should I do?**\n\n' +
				'You\'re always welcome to our support server ♥️ - [https://discord.gg/TMxh6xz](https://discord.gg/TMxh6xz)\n',
		};

		const firstBtn = new MessageButton()
			.setCustomId('first')
			.setLabel('Commands')
			.setStyle('SUCCESS');

		const secondBtn = new MessageButton()
			.setCustomId('second')
			.setLabel('Why is my search result wrong?')
			.setStyle('SUCCESS');

		const thirdBtn = new MessageButton()
			.setCustomId('third')
			.setLabel('There\'re problems using/setting the bot, what should I do?')
			.setStyle('SUCCESS');

		const invite = new MessageButton()
			.setLabel('Invite Bot')
			.setURL('https://discord.com/oauth2/authorize?client_id=559247918280867848&scope=bot&permissions=52288')
			.setStyle('LINK');
		const serverInvite = new MessageButton()
			.setLabel('Support Server')
			.setURL('https://discord.gg/TMxh6xz')
			.setStyle('LINK');


		const btnRows = [
			new MessageActionRow().addComponents(firstBtn, secondBtn),
			new MessageActionRow().addComponents(thirdBtn),
			new MessageActionRow().addComponents(invite, serverInvite),
		];

		try {
			const answer = await interaction.editReply({
				components: btnRows,
				embeds: [{
					title: '📓 Help Menu',
					color: 0x36393E,
					description: options.first,
					// TODO: Update gif
					// image: {
					// 	url: 'https://cdn.discordapp.com/attachments/758209391731277829/841300623684665394/output.gif',
					// },
					footer: {
						text: 'Support: https://discord.gg/TMxh6xz',
						icon_url: interaction.member.user.avatarURL(),
					},
					timestamp: Date.now(),
				}],
				ephimeral: true,
			});

			const filter = (i) => i.user.id === interaction.user.id;

			const collector = answer.createMessageComponentCollector(filter, {
				time: 120000,
			});

			collector.on('collect', async btnInteraction => {
				const embed = btnInteraction.message.embeds[0];

				switch (btnInteraction.customId) {
				case ('first'):
					embed.description = options.first;
					// embed.image = {
					// 	url: 'https://cdn.discordapp.com/attachments/758209391731277829/841300623684665394/output.gif',
					// };
					break;
				case ('second'):
					embed.description = options.second;
					embed.image = null;
					break;
				case ('third'):
					embed.description = options.third;
					embed.image = null;
					break;
				}

				btnInteraction.update({
					components: btnRows,
					embeds: [embed],
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