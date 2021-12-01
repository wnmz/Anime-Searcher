// TODO: Fuck indexes, rewrite the code to work only with entities (objects).
const { MessageActionRow, MessageButton, Message, ButtonInteraction } = require('discord.js');

const Trace = require('../Classes/traceMOE');
const Sauce = require('../Classes/sauceNAO');

const utils = require('../utils');

const { traceMoe_token, sauceNao_token } = require('../../config');

const traceMoe = new Trace(traceMoe_token);
const sauceNAO = new Sauce(sauceNao_token);

const urlCheck = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif)/i; // url check regexp

const search = {
    command: 'search',
    run: async (_, msg, gotErrorsInRow = 0) => {
        let attachments = msg.attachments.size ? msg.attachments.first().url : undefined;
        let url = msg.content.match(urlCheck) ? msg.content.match(urlCheck)[0] : undefined;
        let imageURL = attachments ? attachments : url;

        if (imageURL) {
            try {
                // Trace.moe is decided to be "main" source provider
                let [trace_error, tracemoe_result] = await traceMoe.search(imageURL);
                let [sauce_error, sauceNAO_result] = await sauceNAO.search(imageURL);

                if (trace_error) throw new Error(trace_error);

                // TODO: SauceNao NSFW filter
                if (!msg.channel.nsfw) {
                    tracemoe_result = tracemoe_result.filter(doc => {
                        return !doc.is_adult
                    });
                }

                let results = [...tracemoe_result.slice(0, 5), ...sauceNAO_result.slice(0, 5)];
                if (results.length == 0) return;

                let resultIndex = 0;
                let other_results = utils.stringifyResults(results, resultIndex);
                let answer = await msg.channel.send(utils.formResultEmbed(msg, results, resultIndex, other_results));

                const filter = (i) => i.user.id === msg.author.id;

                const collector = answer.createMessageComponentCollector({ filter, time: 120000 });
                
                collector.on('collect', async interaction => {
                    if (interaction.customId == "down") {
                        if (++resultIndex >= results.length) resultIndex = 0; 
                    }
                    if (interaction.customId == "up") {
                        if (--resultIndex < 0) resultIndex = results.length - 1;
                    }

                    other_results = utils.stringifyResults(results, resultIndex);
                    interaction.update(utils.formResultEmbed(msg, results, resultIndex, other_results));
                });

                collector.on('end', () => {
                    answer.edit(utils.formResultEmbed(msg, results, resultIndex, other_results, true));
                });

            } catch (err) {
                try { // Try Inside Catch looks awful
                    console.log(err);
                    // Missing Permissions
                    if(err?.code == 50013) return msg.author.send("Sorry, I don't have enough permissions to send messages.")

                    let retryBtn = new MessageButton()
                        .setCustomId("retry")
                        .setLabel("Try Again!")
                        .setStyle("SECONDARY")
                        .setEmoji("♻️")

                    let errorMsg = await msg.channel.send({
                        components: gotErrorsInRow > 3 ?  [] : [retryBtn] ,
                        embeds: [{
                            description: `An error occurred while searching. Please try again. (ง •̀_•́)ง`,
                            color: 0x00cc4b
                        }]
                    });

                    if(gotErrorsInRow <= 3) 
                    {
                        const filter = (button) => button.clicker.user.id === msg.author.id;
                        const collector = errorMsg.createButtonCollector(filter, {
                            time: 60000
                        });
    
                        collector.once('collect', button => {
                            button.defer();
                            search.run(_, msg, ++gotErrorsInRow);
                            collector.stop();
                        })
    
                        collector.on('end', () => {
                            errorMsg.delete();
                        });
                    }

                } catch (e) {
                    console.log(err);
                }
            }
        }
        else
        {
            msg.reply("Image not found. Please specify an image.\nExample: `+search URL`")
        }
    }
}

module.exports = search;