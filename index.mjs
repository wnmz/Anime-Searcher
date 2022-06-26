import 'dotenv/config';
import { ShardingManager } from 'discord.js';
import { registerCommands } from './Modules/registerCommands.mjs';

const {
	BOT_TOKEN,
	MONGODB_URI,
	BOT_CLIENT_ID,
} = process.env;

// Mandatory environment variables
if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not defined in process environment variables!');
if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined in process environment variables!');
// Optional
if (BOT_CLIENT_ID) registerCommands(BOT_CLIENT_ID);

const shard = new ShardingManager('./app.mjs', {
	token: BOT_TOKEN,
	totalShards: 10,
	shardList: 'auto',
});

shard.spawn({ amount: shard.totalShards, delay: 5500, timeout: 50000 });
shard.on('shardCreate', sh => {
	console.log(`[SHARD] Shard ${sh.id} was created.`);
});