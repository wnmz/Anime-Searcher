const config = require("../../config");

const reactions = ['1️⃣', '2️⃣', '3️⃣', '⬅️'];

module.exports = {
    command: 'help',
    description: "help command",
    run: async (client, message) => {
        const options = {
            default:
                `**Commands**\n\n` +
                `**\`${config.prefix}search\`** \`image_url/file\` - Start searching for image source.\n` +
                `**\`${config.prefix}setchannel\`** - Set channel in which bot will be triggered on every image.\n\n` +
                `**FAQ**\n\n` +
                `1️⃣ - **How do I set up the bot?**\n` +
                `2️⃣ - **Why is my search result wrong?**\n` +
                `3️⃣ - **There're problems using/setting the bot, what should I do?** \n\n` +
                `\`Click the reactions to select options you need.\``,
            first: 
                `**How do I set up the bot?**\n` +
                `\`There're just a few easy steps to set up the bot.\`\n\n` +
                `**1)** Choose the channel in which bot will work.\n` +
                `**2)** Connect bot to that channel using \`${config.prefix}setchannel\` command.\n` +
                `**Example usage -> **\`${config.prefix}setchannel\` ${message.channel}\n` +
                `**3)** Send any image into selected channel.`,
            second: 
                `**Why is my search result wrong?**\n\n` +
                `Actually idk, but I would recommend you to check this: [https://trace.moe/faq](https://trace.moe/faq)\n` +
                `_____\n` +
                `Click ⬅️ to return to main menu.`,
            third: 
                `**There're problems using/setting the bot, what should I do?**\n\n` +
                `You're always welcome to our support server ♥️ - [https://discord.gg/TMxh6xz](https://discord.gg/TMxh6xz)\n` +
                `______\n` +
                `Click ⬅️ to return to main menu.`
        };

        try {
            let msg = await message.channel.send({
                embed: {
                    title: '📓 Help Menu',
                    color: 0x36393E,
                    description: options.default,
                    footer: {
                        text: 'Support: https://discord.gg/TMxh6xz',
                        icon_url: message.member.user.avatarURL()
                    },
                    timestamp: Date.now()
                }
            })

            const filter = (reaction, user) => {
                return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
            };

            const collector = msg.createReactionCollector(filter, { time: 120000 })
            
            collector.on('collect', async (reaction, user) => {
                let embed = msg.embeds[0];
                reaction.users.remove(message.author.id);

                switch(reaction.emoji.name)
                {
                    case('1️⃣'):
                      embed.description = options.first;
                      embed.image = {
                          url: 'https://cdn.discordapp.com/attachments/758209391731277829/841300623684665394/output.gif'
                      };
                    break;
                    case('2️⃣'):
                        embed.description = options.second;
                        embed.image = null;
                    break;
                    case('3️⃣'):
                        embed.description = options.third;
                        embed.image = null;
                    break;
                    default:
                        embed.description = options.default;
                        embed.image = null;
                    break;
                }

                await msg.edit({embed: embed});
            })

            await Promise.all(reactions.map(r => msg.react(r) ));
        } finally {
            message.channel.stopTyping();
        }
    }
}