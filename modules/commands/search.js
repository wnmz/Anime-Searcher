const Trace = require('../Classes/traceMOE');
const Sauce = require('../Classes/sauceNAO');

const utils = require('../utils');
const traceEmbed = require('../Embeds/traceEmbed');
const sauceEmbed = require('../Embeds/sauceEmbed');

const { traceMoe_token, sauceNao_token } = require('../../config');

const traceMoe = new Trace(traceMoe_token);
const sauceNAO = new Sauce(sauceNao_token);

const urlCheck = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/i; // url check regexp
const reactions = ['⬆️', '⬇️'];

module.exports = {
    command: 'search',
    run: async (_, msg) => {
        let attachments = msg.attachments.size ? msg.attachments.first().url : undefined;
        msg.content = msg.content.match(urlCheck) ? msg.content.match(urlCheck)[0] : undefined;
        let imageURL = attachments ? attachments : msg.content;


        if (imageURL) {
            try {
                msg.channel.startTyping();
                let tracemoe_result = await traceMoe.search(imageURL);
                let sauceNAO_result = await sauceNAO.search(imageURL);

                if (!msg.channel.nsfw) { // sauceNAO NSFW filter is still in WIP
                    tracemoe_result = tracemoe_result.filter(doc => { // Delete all nsfw content from result if we're not in nsfw channel
                        return !doc.is_adult
                    });
                }

                let results = [...tracemoe_result.slice(0, 5), ...sauceNAO_result.slice(0, 5)];

                let resultIndex = 0;
                let other_results = utils.formOtherResults(results, resultIndex);
                let answer;

                switch (results[resultIndex].origin) {
                    case 'trace' :
                        answer = await msg.channel.send(traceEmbed(results[resultIndex], other_results, msg));
                    break;
                    case 'sauce':
                        answer = await msg.channel.send(sauceEmbed(results[resultIndex], other_results, msg));
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
                        if(resultIndex >= results.length) resultIndex = 0;
                    } else {
                        resultIndex--;
                        if (resultIndex < 0) resultIndex = results.length - 1;
                    }

                    let index = resultIndex;
                    let other_results = utils.formOtherResults(results, index);

                    answer.edit(
                       results[resultIndex].origin == 'trace' ?
                            traceEmbed(results[index], other_results, msg) : 
                            sauceEmbed(results[index], other_results, msg)
                    )
                });

                collector.on('end', async () => {
                    answer.react('🐧')
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