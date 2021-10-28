﻿const Mongodb = require('./modules/mongo');
const config = require('./config.js');
const search = require('./modules/commands/search');
const antispam = require('./modules/antispam');

const { Client, Intents, Options } = require('discord.js');

const fs = require('fs');
const DBL = require("dblapi.js");

const db = new Mongodb(config.mongodb_uri);
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
        partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER']
});

const dbl = config.topgg_token ? new DBL(config.topgg_token, client) : undefined;
const urlCheck = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/i; // url check regexp
const modules = {};




client.login(config.token);

client.on('ready', async () => {
    await db.init();
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Working with: ${client.guilds.cache.size} guilds`);
    client.user.setActivity(`${config.prefix}help`, {
        type: 'LISTENING'
    })

    //TODO: Replace FS with modules and add slash commands support
    try {
        fs.readdir('./modules/commands/', (err, files) => {
            files.map(file => {
                if (file.split('.')[1] !== 'js') return
                modules[config.prefix + file.split('.')[0]] = require(`./modules/commands/${file}`);
                console.log(`${file} was successfully loaded!`);
            })
        })
    } catch (e) {
        console.log(e);
    }
})

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return
    try {
        let message = msg.content.toLocaleLowerCase();
        let cmd = message.split(' ')[0]
        if (Object.keys(modules).includes(cmd)) {
            let isSpammer = antispam.checkUser(msg);
            if (!isSpammer) {
                msg.channel.sendTyping();
                return modules[Object.keys(modules)[Object.keys(modules).indexOf(cmd)]].run(client, msg, config, db);
            }
        }

        let guildData = await db.getGuildSettings(msg.guild.id);

        let attachments = msg.attachments.size ? msg.attachments.first().url : undefined;
        let imgUrl = msg.content.match(urlCheck) == null ? false : true;
        let isIncludesImage = attachments ? true : imgUrl

        if (guildData && guildData.settings.workChannel && msg.channel.id == guildData.settings.workChannel && isIncludesImage) {
            let isSpammer = antispam.checkUser(msg);
            if(isSpammer) return;
            msg.channel.sendTyping();
            search.run(client, msg);
        } 
        
    } catch (err) {
        console.log(err)
    }
})