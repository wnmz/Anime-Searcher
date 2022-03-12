/* eslint-disable curly */
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	name: 'setchannel',
	description: 'set bot\'s work channel',
	isInteraction: true,
	isCommand: false,
	getSlashBuilder: function() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription('set bot\'s work channel')
			.addChannelOption(options =>
				options.setName('channel')
					.setDescription('Select text channel in wich the bot will search for every image\'s source')
					.setRequired(true),
			);
	},
	run: async (interaction, db) => {
		if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({
			content: 'You don\'t have permission to use this command!',
			ephemeral: true,
		});

		const workChannel = interaction.options.getChannel('channel');
		if (!workChannel) return interaction.reply({
			content: '(╯°□°）╯︵ ┻━┻ The mentioned channel does not exist! (╥﹏╥)',
			ephemeral: true,
		});

		if (workChannel.type !== 'GUILD_TEXT') return interaction.reply({
			content: '(づ￣ ³￣)づ How am i supposed to send messages in non-text channel? Please specify a *text* channel',
			ephemeral: true,
		});

		db.setGuildSettings(interaction.guild.id, workChannel.id)
			.then(() => {
				interaction.reply({
					content: `(づ￣ ³￣)づ ${workChannel} now can be used to search anime source! ฅ^•ﻌ•^ฅ`,
					ephemeral: true,
				});
			})
			.catch((err) => {
				interaction.reply({
					content: '(╯°□°）╯︵ ┻━┻ Something went wrong! Please, try again or join our **Support Server ฅ(≈>ܫ<≈)♥** https://discord.gg/TMxh6xz',
					ephemeral: true,
				});
				console.log(err);
			});

	},
};