import interactions from './Modules/messageInteractions.mjs';
import commands from './Modules/commands.mjs';
import Mongodb from './Modules/mongo.mjs';
import { isUserSpammer } from './Modules/antispam.mjs';

import Discord from 'discord.js-light';
import DBL from 'dblapi.js';

const {
	BOT_TOKEN,
	TOPGG_TOKEN,
	MONGODB_URI,
} = process.env;

const urlCheckRegExp = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif)/i;

const db = new Mongodb(MONGODB_URI);
const client = new Discord.Client({
	makeCache: Discord.Options.cacheWithLimits({
		ApplicationCommandManager: 0, // guild.commands
		BaseGuildEmojiManager: 0, // guild.emojiscls
		ChannelManager: 0, // client.channels
		GuildChannelManager: 0, // guild.channels
		GuildBanManager: 0, // guild.bans
		GuildInviteManager: 0, // guild.invites
		GuildManager: Infinity, // client.guilds
		GuildMemberManager: 0, // guild.members
		GuildStickerManager: 0, // guild.stickers
		GuildScheduledEventManager: 0, // guild.scheduledEvents
		MessageManager: 0, // channel.messages
		PermissionOverwriteManager: 0, // channel.permissionOverwrites
		PresenceManager: 0, // guild.presences
		ReactionManager: 0, // message.reactions
		ReactionUserManager: 0, // reaction.users
		RoleManager: 0, // guild.roles
		StageInstanceManager: 0, // guild.stageInstances
		ThreadManager: 0, // channel.threads
		ThreadMemberManager: 0, // threadchannel.members
		UserManager: 0, // client.users
		VoiceStateManager: 0 // guild.voiceStates
	}),
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
	],
	messageCacheMaxSize: 1,
	messageCacheLifetime: 1,
	partials: ['CHANNEL', 'REACTION', 'USER'],
});

const dbl = TOPGG_TOKEN ? new DBL(TOPGG_TOKEN, client) : undefined;

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
	if (!interaction.isCommand() && !interaction.isMessageContextMenu()) return;
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