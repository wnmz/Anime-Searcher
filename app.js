const Mongodb = require('./modules/mongo');
const config = require('./config.js');
const search = require('./modules/commands/search');

const Discord = require('discord.js');
const fs = require('fs');
const DBL = require("dblapi.js");

class Searcher extends Discord.Client {
    constructor() {
        super({
            messageCacheMaxSize: 1,
            messageCacheLifetime: 30,
            messageSweepInterval: 15,
            // shardCount: 'auto',
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER']
        });
        this.modules = new Object();
        this.dbl = config.topgg_token ? new DBL(config.topgg_token, this) : undefined;
        this.db = new Mongodb(config.mongodb_uri);
    }

    start() {
        this.login(config.token);
        this.on('ready', async () => {
            console.log(`Logged in as ${this.user.tag}`);
            console.log(`Working with: ${this.guilds.cache.size} guilds`);
            this.user.setActivity('+setchannel', {
                type: 'LISTENING'
            })
            this.cmdHandler();
        })
    }

    cmdHandler() {
        try {
            fs.readdir('./modules/commands/', (err, files) => {
                files.map(file => {
                    if (file.split('.')[1] !== 'js') return
                    this.modules[config.prefix + file.split('.')[0]] = require(`./modules/commands/${file}`);
                    console.log(`${file} was successfully loaded!`);
                })
            })
        } catch (e) {
            console.log(e);
        }

        this.on('message', async msg => {
            if (msg.author.bot) return;
            let message = msg.content.toLocaleLowerCase();
            try {
                let cmd = message.split(' ')[0]
                if (Object.keys(this.modules).includes(cmd)) {
                    msg.channel.startTyping();
                    this.modules[Object.keys(this.modules)[Object.keys(this.modules).indexOf(cmd)]].run(this, msg, config, this.db);
                }
            } catch (err) {
                console.log(err)
            } finally {
                msg.channel.stopTyping();
            }

            if (message.attachments && !message.startsWith(config.prefix + 'search')) return; // to prevent multiple messages when we use +search in work channel
            let guildData = await this.db.getGuildSettings(msg.guild.id);
            if (guildData && guildData.settings.workChannel && msg.channel.id == guildData.settings.workChannel) return search.run(this, msg);
        })
    }
}

module.exports = {
    Searcher
};