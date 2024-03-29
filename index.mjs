import 'dotenv/config';
import { registerCommands } from './Modules/registerCommands.mjs';
import { ClusterManager, HeartbeatManager } from 'discord-hybrid-sharding';

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

const manager = new ClusterManager('./app.mjs', {
	totalShards: 'auto',
	shardsPerClusters: 5,
	token: BOT_TOKEN,
	respawn: true,
});

manager.extend(
	new HeartbeatManager({
		interval: 2000,
		maxMissedHeartbeats: 5,
	}),
);

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });