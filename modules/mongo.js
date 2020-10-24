const mongoClient = require("mongodb").MongoClient;

class DB {
    constructor(mongoURI) {
        this.mongoURI = mongoURI;
    }

    getGuildSettings(guildID) {
        return new Promise(async (resolve, reject) => {
            let client = await mongoClient.connect(this.mongoURI, {
                    useUnifiedTopology: true
                })
                .catch(err => {
                    console.log(err);
                });
            if (!client) return;
            try {
                let db = client.db('weebSearcher');
                let collection = db.collection('Guilds');
                let res = await collection.findOne({
                    id: guildID
                })
                resolve(res);
            } catch (err) {
                console.log(err);
            } finally {
                client.close();
            }
        })
    }

    async setGuildSettings(guildID, workChannelID) {
        return new Promise(async (resolve, reject) => {
            let client = await mongoClient.connect(this.mongoURI, {
                    useUnifiedTopology: true
                })
                .catch(err => {
                    console.log(err);
                });
            if (!client) return;
            try {
                let db = client.db('weebSearcher');
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
            } finally {
                client.close();
            }
        })
    }
}
module.exports = DB