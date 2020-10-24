const Trace = require('../trace');
const embed = require('../embed');
const config = require('../../config')
const traceMoe = new Trace(config.traceMoe_token);

const urlCheck = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/i; // url check regexp
const reactions = ['⬅️', '➡️'];

module.exports = {
    command: 'search',
    description: "search anime source",
    run: async (client, msg, config, db) => {
        let attachments = msg.attachments.size ? msg.attachments.first().url : undefined;
        msg.content = msg.content.match(urlCheck) ? msg.content.match(urlCheck)[0] : undefined;
        if (urlCheck.test(msg.content) || urlCheck.test(attachments)) {
            try {
                msg.channel.startTyping();
                let base64 = await traceMoe.getImageBase64(attachments ? attachments : msg.content);
                let result = await traceMoe.search(base64);
                let nsfw_counter = 0;
                if (!msg.channel.nsfw) result.docs = result.docs.filter(doc => { //Delete all nsfw content from result if we're not in nsfw channel
                    nsfw_counter++;
                    return !doc.is_adult
                })
                if (!result.docs.length) {
                    return msg.channel.send({
                        embed: {
                            title: `No ${nsfw_counter ? 'SFW' : ''} results found (⌣_⌣”)`,
                            description: `${nsfw_counter ? 'Try searching in NSFW channel.' : ''}`
                        }
                    })
                }
                let ans = await msg.channel.send({
                    embed: embed(result.docs, 0, msg)
                });
                reactions.map(async (symb) => {
                    await ans.react(symb)
                })
                const filter = (reaction, user) => {
                    return reactions.includes(reaction.emoji.name) && user.id == msg.author.id;
                };
                const collector = ans.createReactionCollector(filter, {
                    time: 120000
                });
                let resultIndex = 0;
                collector.on('collect', reaction => {
                    reaction.users.remove(msg.author.id);
                    if (reaction.emoji.name == '➡️') {
                        resultIndex++;
                    } else {
                        resultIndex--;
                        if (resultIndex <= 0) currentIndex = 0;
                    }
                    ans.edit({
                        embed: embed(result.docs, resultIndex % result.docs.length, msg)
                    })
                });
                collector.on('end', async (collected) => {
                    await ans.react('🐧')
                });
            } catch (err) {
                msg.channel.send({
                    embed: {
                        description: `Something went wrong (ง •̀_•́)ง`,
                        color: 0xff322b
                    }
                });
            } finally {
                msg.channel.stopTyping();
            }
        }
    }
}