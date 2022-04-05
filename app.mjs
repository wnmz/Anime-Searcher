import interactions from './Modules/messageInteractions.mjs';
import commands from './Modules/commands.mjs';
import Mongodb from './Modules/mongo.mjs';
import { isUserSpammer } from './Modules/antispam.mjs';

import { Client, Intents, Options } from 'discord.js';
import DBL from 'dblapi.js';

const {
	BOT_TOKEN,
	TOPGG_TOKEN,
	MONGODB_URI,
} = process.env;

const urlCheckRegExp = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif)/i;

const db = new Mongodb(MONGODB_URI);
const client = new Client({
	makeCache: Options.cacheWithLimits({
		MessageManager: 0,
		GuildBanManager: 0,
		PresenceManager: 0,
		ReactionManager: 0,
		ReactionUserManager: 0,
		StageInstanceManager: 0,
		ThreadManager: 0,
		ThreadMemberManager: 0,
		VoiceStateManager: 0,
	}),
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.DIRECT_MESSAGES,
	],
	messageCacheMaxSize: 1,
	messageCacheLifetime: 1,
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
});

const dbl = TOPGG_TOKEN ? new DBL(TOPGG_TOKEN, client) : undefined;

client.on('ready', async () => {
	await db.init();
	console.log(`Logged in as ${client.user.tag}`);
	console.log(`Working with: ${client.guilds.cache.size} guilds`);
	client.user.setActivity('/help', {
		type: 'LISTENING',
	});
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	if (!interactions[interaction.commandName]) return;
	interactions[interaction.commandName].run(interaction, db);
});

client.on('messageCreate', async msg => {
	if (msg.author.bot) return;

	// In case the message includes image and sent to the work channel
	const isIncludesImage = msg.attachments?.first?.()?.url ?? msg.content.match(urlCheckRegExp)?.[0];
	if (isIncludesImage) {
		if (isUserSpammer(msg)) return;
		const gildData = await db.getGuildSettings(msg.guild.id);
		if (msg.channel.id == gildData?.settings?.workChannel) return commands['search'].run(msg, db, false);
	}

	// ------- Outdated prefix commands ------- 
	// const rawCmd = msg.content.split(' ')[0];
	// const cmd = rawCmd.toLowerCase();

	// if (cmd[0] == '+' && interactions[cmd.slice(1, cmd.length)]) {
	// 	return msg.channel.send({
	// 		content: 'Sorry, but prefix commands are outdated. ' +
	// 			'Please use slash version of this command.\n' +
	// 			`Example: **/${cmd.slice(1, cmd.length)}**`,
	// 	});
	// }

	// if (!interactions[cmd]) return;
	// if (!interactions[cmd].isCommand) return;
	// return interactions[cmd].run(msg, db);
});

client.login(BOT_TOKEN);