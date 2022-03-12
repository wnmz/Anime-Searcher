/* eslint-disable no-async-promise-executor */
import { MongoClient } from 'mongodb';

// TODO: Multiple channel binding [Rework DB Structure]
export default class DB {
	constructor(mongoURI) {
		this.client = new MongoClient(mongoURI, {
			useUnifiedTopology: true,
		});
	}

	init() {
		return new Promise(async (resolve, reject) => {
			this.client = await this.client.connect(this.mongoURI, {
				useUnifiedTopology: true,
			})
				.catch(err => {
					reject(err);
				});
			console.log('DB connection established!');
			resolve();
		});
	}

	getGuildSettings(guildID) {
		return new Promise(async (resolve) => {
			if (!this.client) return;
			try {
				const db = this.client.db('weebSearcher');
				const collection = db.collection('Guilds');
				const res = await collection.findOne({
					id: guildID,
				});
				resolve(res);
			}
			catch (err) {
				console.log(err);
			}
		});
	}

	async setGuildSettings(guildID, workChannelID) {
		return new Promise(async (resolve) => {
			if (!this.client) return;
			try {
				const db = this.client.db('weebSearcher');
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
				resolve();
			}
			catch (err) {
				console.log(err);
			}
		});
	}
}