const Trace = require('../Classes/traceMOE');
const Sauce = require('../Classes/sauceNAO');

const utils = require('../utils');

const { traceMoe_token, sauceNao_token } = require('../../config');
const { MessageButton, MessageActionRow } = require('discord-buttons');

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
                // Trace.moe is decided to be "main" source provider
                //cuz it's api is less spam protected
                let [trace_error, tracemoe_result] = await traceMoe.search(imageURL);
                let sauceNAO_result = await sauceNAO.search(imageURL);

                if(trace_error) throw new Error(trace_error);

                if (!msg.channel.nsfw) { // sauceNAO NSFW filter is still in WIP
                    tracemoe_result = tracemoe_result.filter(doc => { // Delete all nsfw content from result if we're not in nsfw channel
                        return !doc.is_adult
                    });
                }

                let results = [...tracemoe_result.slice(0, 5), ...sauceNAO_result.slice(0, 5)];
                if(results.length == 0) return;

                let resultIndex = 0;
                let other_results = utils.formOtherResults(results, resultIndex);
                let answer;

                answer = await msg.channel.send(utils.formMsgObject(msg, results, resultIndex, other_results, true));


                const filter = (button) =>  button.clicker.user.id === msg.author.id;
                                
                const collector = answer.createButtonCollector(filter, {
                    time: 120000
                });
                
                    
                collector.on('collect', async button => {
                    button.defer();
                    if (button.id == "next") {
                        resultIndex++;
                        if(resultIndex >= results.length) resultIndex = 0;
                    } else {
                        resultIndex--;
                        if (resultIndex < 0) resultIndex = results.length - 1;
                    }

                    let other_results = utils.formOtherResults(results, resultIndex);
                    answer.edit(utils.formMsgObject(msg, results, resultIndex, other_results, true));
                });

                collector.on('end', () => {
                    answer.edit(utils.formMsgObject(msg, results, resultIndex, other_results, false));
                });
                
            } catch (err) {
                console.error(err);
                msg.channel.send({
                    embed: {
                        description: `An error occurred while searching. Please try again. (ง •̀_•́)ง`,
                        color: 0x00cc4b
                    }
                });
            } finally {
                msg.channel.stopTyping();
            }
        }
    }
}