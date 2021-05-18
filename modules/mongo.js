const mongoClient = require("mongodb").MongoClient;

class DB {
    constructor(mongoURI) {
        this.mongoURI = mongoURI;
        this.client;
    }

    init() {
        return new Promise(async (resolve, reject) => {
            this.client = await mongoClient.connect(this.mongoURI, {
                    useUnifiedTopology: true
                })
                .catch(err => {
                    reject(err);
                });
            console.log('DB connection established!');
            resolve();
        })
    }

    getGuildSettings(guildID) {
        return new Promise(async (resolve, reject) => {
            if (!this.client) return;
            try {
                let db = this.client.db('weebSearcher');
                let collection = db.collection('Guilds');
                let res = await collection.findOne({
                    id: guildID
                })
                resolve(res);
            } catch (err) {
                console.log(err);
            }
        })
    }

    async setGuildSettings(guildID, workChannelID) {
        return new Promise(async (resolve, reject) => {
            if (!this.client) return;
            try {
                let db = this.client.db('weebSearcher');
                let collection = db.collection('Guilds');
                let filter = {
                    id: guildID
                }
                await collection.updateOne(filter, {
                    $set: {
                        'settings.workChannel': workChannelID
                    }
                }, {
                    upsert: true
                });
                resolve();
            } catch (err) {
                console.log(err);
            }
        })
    }
}
module.exports = DB