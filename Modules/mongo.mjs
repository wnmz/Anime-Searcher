import { MongoClient } from 'mongodb';
import Redis from 'redis';

export default class DB {
	constructor(mongoURI, redisURI) {
		this.mongoURI = mongoURI;
		this.redisURI = redisURI;
		this.isConnected = false;
		this.mongoClient = new MongoClient(mongoURI, {
			useUnifiedTopology: true,
		});
		this.max_reconnect_attempts = 5;
		this.redisClient = Redis.createClient(redisURI);
	}

	async connect(reconnect_attempt = 0) {
		if (reconnect_attempt > this.max_reconnect_attempts) {
			throw new Error('Maximum DB reconnect attemps has reached. Closing the app...');
		}

		try {
			await this.redisClient.connect();
			await this.mongoClient.connect();
			this.isConnected = true;
			console.log('MongoDB and Redis are connected!');
		} catch (err) {
			console.error(`DB Error: ${err}`);
			console.error(`DB connection retry #${reconnect_attempt} will be in 5 seconds`);

			if(this.redisClient.isOpen) await this.redisClient.disconnect();
			await this.mongoClient.close();
			setTimeout(() => {
				this.connect(++reconnect_attempt);
			}, 5000);
		}

		this.redisClient.on('error', (err) => {
			console.error(`Redis connection error: ${err}`);
		});

		this.redisClient.on('ready', () => {
			console.log('Redis connected');
		});
	}

	async getGuildSettings(guildID) {
		try {
			const cachedSettings = await this.getGuildSettingsFromCache(guildID);

			if (cachedSettings) {
				return cachedSettings;
			}

			const db = this.mongoClient.db('weebSearcher');
			const collection = db.collection('Guilds');
			const res = await collection.findOne({
				id: guildID,
			});

			if (res) {
				await this.cacheGuildSettings(guildID, res);
			}

			return res;
		} catch (err) {
			console.error(`MongoDB error: ${err}`);
			throw new Error(`Failed to get guild settings: ${err}`);
		}
	}

	async getGuildSettingsFromCache(guildID) {
		return new Promise(async(resolve) => {
			try {
				let res = await this.redisClient.get(`guild_settings_${guildID}`);
				if (res) {
					resolve(JSON.parse(res));
				}
			} 
			finally {
				resolve(null);
			}
		});
	}

	async cacheGuildSettings(guildID, settings) {
		return new Promise((resolve, reject) => {
			this.redisClient.set(`guild_settings_${guildID}`, JSON.stringify(settings), (err) => {
				if (err) {
					console.error(`Redis error: ${err}`);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	async setGuildSettings(guildID, workChannelID) {
		try {
			const db = this.mongoClient.db('weebSearcher');
			const collection = db.collection('Guilds');
			const filter = {
				id: guildID,
			};
			await collection.updateOne(filter, {
				$set: {
					'settings.workChannel': workChannelID,
				},
			}, {
				upsert: true,
			});

			const settings = {
				id: guildID,
				settings: {
					workChannel: workChannelID
				}
			}

			this.cacheGuildSettings(guildID, settings);
		} catch (err) {
			console.error(`MongoDB error: ${err}`);
			throw new Error(`Failed to set guild settings: ${err}`);
		}
	}
}
