import { MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

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
	run: async (message) => {
		const options = {
			default: '**Commands**\n\n' +
				'**`/search`** `image_url/file` - Start searching for image source.\n' +
				'**`/setchannel`** - Set channel in which bot will be triggered on every image.\n\n' +
				'\n`Click the buttons below to select options you need.`',
			first: '**How do I set up the bot?**\n' +
				'`There\'re just a few easy steps to set up the bot.`\n\n' +
				'**1)** Choose text channel in which bot process every image.\n' +
				'**2)** Connect bot to that channel using `/setchannel` command.\n' +
				`**Example usage -> **\`/setchannel\` ${message.channel}\n` +
				'**3)** Send any image into selected channel.',
			second: '**Why is my search result wrong?**\n\n' +
				'Actually idk, but I would recommend you to check this: [https://trace.moe/faq](https://trace.moe/faq)\n' +
				'_____\n',
			third: '**There\'re problems using/setting the bot, what should I do?**\n\n' +
				'You\'re always welcome to our support server ♥️ - [https://discord.gg/TMxh6xz](https://discord.gg/TMxh6xz)\n' +
				'______\n',
		};

		const firstBtn = new MessageButton()
			.setCustomId('first')
			.setLabel('How do I set up the bot?')
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

		const exitBtn = new MessageButton()
			.setCustomId('exit')
			.setLabel('Support Server')
			.setLabel('Delete Message')
			.setStyle('DANGER');

		const btnRows = [
			new MessageActionRow().addComponents(firstBtn, secondBtn),
			new MessageActionRow().addComponents(thirdBtn),
			new MessageActionRow().addComponents(invite, serverInvite, exitBtn),
		];

		try {
			const msg = await message.channel.send({
				components: btnRows,
				embeds: [{
					title: '📓 Help Menu',
					color: 0x36393E,
					description: options.first,
					image: {
						url: 'https://cdn.discordapp.com/attachments/758209391731277829/841300623684665394/output.gif',
					},
					footer: {
						text: 'Support: https://discord.gg/TMxh6xz',
						icon_url: message.member.user.avatarURL(),
					},
					timestamp: Date.now(),
				}],
			});

			const filter = (i) => i.user.id === message.author.id;

			const collector = msg.createMessageComponentCollector(filter, {
				time: 120000,
			});

			collector.on('collect', async interaction => {
				const embed = interaction.message.embeds[0];

				switch (interaction.customId) {
				case ('first'):
					embed.description = options.first;
					embed.image = {
						url: 'https://cdn.discordapp.com/attachments/758209391731277829/841300623684665394/output.gif',
					};
					break;
				case ('second'):
					embed.description = options.second;
					embed.image = null;
					break;
				case ('third'):
					embed.description = options.third;
					embed.image = null;
					break;

				case ('exit'):
					collector.stop();
					break;
				}

				await interaction.update({
					components: btnRows,
					embeds: [embed],
				});
			});

			collector.on('end', () => {
				msg.delete();
			});
		}
		catch (e) {
			console.log(e);
		}
	},
};