module.exports = {
    command: 'setchannel',
    description: "set bot's work channel",
    run: async (client, msg, config, db) => {
        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(`${msg.author}, You don't have permission to use this command!`);
        let workChannel = msg.mentions.channels.first();
        if (!workChannel) return msg.channel.send('(╯°□°）╯︵ ┻━┻ The mentioned channel does not exist! (╥﹏╥)');
        db.setGuildSettings(msg.guild.id, workChannel.id)
            .then(() => {
                msg.channel.send(`(づ￣ ³￣)づ ${workChannel} now can be used to search anime source! ฅ^•ﻌ•^ฅ`);
            })
            .catch((err)=>{
                console.log(err)
                msg.channel.send('(╯°□°）╯︵ ┻━┻ Something went wrong! Please, try again. Support server: https://discord.gg/TMxh6xz');
            })

    }
}