import interactions from './Modules/messageInteractions.mjs';
import commands from './Modules/commands.mjs';
import Mongodb from './Modules/mongo.mjs';
import { isUserSpammer } from './Modules/antispam.mjs';

import { Client, IntentsBitField, Options, Partials, Sweepers } from 'discord.js';
import DBL from 'dblapi.js';

const {
	BOT_TOKEN,
	TOPGG_TOKEN,
	MONGODB_URI,
} = process.env;

const urlCheckRegExp = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif)/i;
const db = new Mongodb(MONGODB_URI);
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageTyping,
	],
	partials: [
		Partials.GuildMember,
		Partials.Channel,
		Partials.GuildScheduledEvent,
		Partials.Message,
		Partials.Reaction,
		Partials.ThreadMember,
		Partials.User
	],
	makeCache: Options.cacheWithLimits({
		ApplicationCommandManager: { maxSize: 0 },
		BaseGuildEmojiManager: { maxSize: 0 },
		GuildEmojiManager: { maxSize: 0 },
		GuildBanManager: { maxSize: 0 },
		GuildInviteManager: { maxSize: 0 },
		GuildMemberManager: {
			maxSize: 1,
			keepOverLimit: (member) => member.id === client.user.id,
		},
		GuildStickerManager: { maxSize: 0 },
		MessageManager: {
			maxSize: 50,
			sweepInterval: 60,
			sweepFilter: Sweepers.filterByLifetime({
				lifetime: 120000
			})
		},
		PresenceManager: { maxSize: 0 },
		ReactionManager: { maxSize: 0 },
		ReactionUserManager: { maxSize: 0 },
		StageInstanceManager: { maxSize: 0 },
		ThreadManager: { maxSize: 0 },
		ThreadMemberManager: { maxSize: 0 },
		UserManager: { maxSize: 0 },
		VoiceStateManager: { maxSize: 0 }
	}),
	sweepers: {
		...Options.DefaultSweeperSettings,
		invites: { interval: 10, lifetime: 1 },
		messages: { interval: 60, lifetime: 10 },
		threads: { interval: 10, lifetime: 1 },
	}
});

//const dbl = TOPGG_TOKEN ? new DBL(TOPGG_TOKEN, client) : undefined;

let dbInitialized = false;

client.on('ready', async () => {
	await db.init();
	dbInitialized = true;
	console.log(`Logged in as ${client.user.tag}`);
	console.log(`Working with: ${client.guilds.cache.size} guilds`);
	client.user.setActivity('/help', {
		type: 'LISTENING',
	});
});

client.on('interactionCreate', async (interaction) => {
	if (!dbInitialized) return;
	if (!interaction.isCommand() && !interaction.isMessageContextMenuCommand()) return;
	if (!interactions[interaction.commandName]) return;
	interactions[interaction.commandName].run(interaction, db);

});

client.on('messageCreate', async msg => {
	if (!dbInitialized) return;

	if (msg.author.bot) return;

	// In case the message includes image and sent to the work channel
	const isIncludesImage = msg.attachments?.first?.()?.url ?? msg.content.match(urlCheckRegExp)?.[0];
	if (isIncludesImage) {
		if (isUserSpammer(msg)) return;
		const gildData = await db.getGuildSettings(msg.guild.id);
		if (msg.channel.id == gildData?.settings?.workChannel) return commands['search'].run(msg, db, false);
	}
});

client.login(BOT_TOKEN);