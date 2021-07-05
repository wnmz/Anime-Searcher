﻿const Mongodb = require('./modules/mongo');
const config = require('./config.js');
const search = require('./modules/commands/search');
const antispam = require('./modules/antispam');

const Discord = require('discord.js');
const fs = require('fs');
const DBL = require("dblapi.js");

const db = new Mongodb(config.mongodb_uri);
const client = new Discord.Client({
    messageCacheMaxSize: 1,
    messageCacheLifetime: 1,
    messageSweepInterval: 1,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER']
});

const DiscordButtons = require("discord-buttons")(client);
const dbl = config.topgg_token ? new DBL(config.topgg_token, client) : undefined;

const modules = {};

client.login(config.token);

client.on('ready', async () => {
    await db.init();
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Working with: ${client.guilds.cache.size} guilds`);
    client.user.setActivity(`${config.prefix}help`, {
        type: 'LISTENING'
    })

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

client.on('message', async (msg) => {
    if (msg.author.bot) return
    let message = msg.content.toLocaleLowerCase();
    try {
        let cmd = message.split(' ')[0]
        if (Object.keys(modules).includes(cmd)) {
            let isSpammer = antispam.checkUser(msg);
            if (!isSpammer) {
                msg.channel.startTyping();
                return modules[Object.keys(modules)[Object.keys(modules).indexOf(cmd)]].run(client, msg, config, db);
            }

        }

        let guildData = await db.getGuildSettings(msg.guild.id);
        if (guildData && guildData.settings.workChannel && msg.channel.id == guildData.settings.workChannel) {
            let isSpammer = antispam.checkUser(msg);
            if (!isSpammer) return search.run(client, msg);
        } 
        
    } catch (err) {
        console.log(err)
    } finally {
        msg.channel.stopTyping();
    }
})