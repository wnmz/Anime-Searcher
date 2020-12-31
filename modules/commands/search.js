const Trace = require('../trace');
const Sauce = require('../sauceNAO');

const utils = require('../utils');
const traceEmbed = require('../traceEmbed');
const sauceEmbed = require('../sauceEmbed');

const config = require('../../config');

const traceMoe = new Trace(config.traceMoe_token);
const sauceNAO = new Sauce(config.sauceNAO_token);

const urlCheck = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/i; // url check regexp
const reactions = ['⬆️', '⬇️'];

module.exports = {
    command: 'search',
    description: "search anime source",
    run: async (client, msg, config, db) => {
        let attachments = msg.attachments.size ? msg.attachments.first().url : undefined;
        msg.content = msg.content.match(urlCheck) ? msg.content.match(urlCheck)[0] : undefined;
        let imageURL = attachments ? attachments : msg.content;

        if (imageURL) {
            try {
                msg.channel.startTyping();
               // let base64 = await utils.getImageBase64(imageURL);
                let tracemoe_result = await traceMoe.search(imageURL);
                let sauceNAO_result = await sauceNAO.search(imageURL);

                if (!msg.channel.nsfw) { // sauceNAO NSFW filter is still in WIP
                    tracemoe_result = tracemoe_result.filter(doc => { //Delete all nsfw content from result if we're not in nsfw channel
                        return !doc.is_adult
                    });
                }

                // if (!tracemoe_result.length) {
                //     return msg.channel.send({
                //         embed: {
                //             title: `No ${nsfw_counter ? 'SFW' : ''} results found (⌣_⌣”)`,
                //             description: `${nsfw_counter ? 'Try searching in NSFW channel.' : ''}`
                //         }
                //     })
                // }

                let results = [...tracemoe_result.slice(0, 5), ...sauceNAO_result.slice(0, 5)];

                // let attachments = await Promise.all(sauceNAO_result.slice(0, 5).map((res, index) => { // Resizing lowres sauceNAO results
                //     return utils.resizeImage(res.thumbnail, index)
                // }))

                let resultIndex = 0;
                let other_results = utils.formOtherResults(results, resultIndex);
                let answer;

                switch (results[resultIndex].from) {
                    case 'trace' :
                        answer = await msg.channel.send(traceEmbed(results[resultIndex], other_results, msg));
                    break;
                    case 'sauce':
                        answer = await msg.channel.send(await sauceEmbed(results[resultIndex], other_results, msg));
                    break
                }

                reactions.map(async (symb) => {
                    await answer.react(symb)
                })

                const filter = (reaction, user) => {
                    return reactions.includes(reaction.emoji.name) && user.id == msg.author.id;
                };
                
                const collector = answer.createReactionCollector(filter, {
                    time: 120000
                });

                collector.on('collect', async reaction => {
                    reaction.users.remove(msg.author.id);

                    if (reaction.emoji.name == '⬇️') {
                        resultIndex++;
                        if(resultIndex >= results.length - 1) resultIndex = 0;
                    } else {
                        resultIndex--;
                        if (resultIndex <= 0) resultIndex = results.length - 1;
                    }

                    let index = resultIndex;
                    let other_results = utils.formOtherResults(results, index);

                    answer.edit(
                       results[resultIndex].from == 'trace' ?
                        traceEmbed(results[index], other_results, msg) : 
                        await sauceEmbed(results[index], other_results, msg)
                    )
                });

                collector.on('end', async (collected) => {
                    await answer.react('🐧')
                });
            } catch (err) {
                console.error(err);
                msg.channel.send({
                    embed: {
                        description: `An error occurred while searching. Please try again. (ง •̀_•́)ง`,
                        color: 0xff322b
                    }
                });
            } finally {
                msg.channel.stopTyping();
            }
        }
    }
}