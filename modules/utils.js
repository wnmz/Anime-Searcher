const axios = require('axios')
const traceEmbed = require('./Embeds/traceEmbed');
const sauceEmbed = require('./Embeds/sauceEmbed');
const DiscordButtons = require('discord-buttons');

module.exports = {
    getImageBase64(url) {
        return new Promise(async (resolve, reject) => {
            try {
                let image = await axios.get(url, {
                    responseType: 'arraybuffer'
                });
                let returnedB64 = Buffer.from(image.data, 'binary').toString('base64');
                resolve(returnedB64)
            } catch (err) {
                reject(err)
            }
        })
    },

    formOtherResults(results, resultIndex) {
        let otherResults = {
            trace: '',
            sauce: '',
        };

        for (let i = 0; i < results.length; i++) {
            let r = results[i];
            if (r.origin == 'trace') {
                otherResults.trace += `${i == resultIndex ? '👉 ' : ''}[${r.title_english || r.title_romaji}](https://anilist.co/anime/${r.anilist}/)\n`
            } else {
                otherResults.sauce += `${i == resultIndex ? '👉 ' : ''}[${r.source}](https://anidb.net/anime/${r.anidb_aid})\n`
            }
        }
        return otherResults;
    },

    formMsgObject(msg, results, resultIndex, other_results, includeButtons = true) {
        let msgObj = {};

        let prevBtn = new DiscordButtons.MessageButton()
            .setLabel("Prev")
            .setStyle("green")
            .setEmoji("⬆️")
            .setID("prev");

        let nextBtn = new DiscordButtons.MessageButton()
            .setLabel("Next")
            .setStyle("green")
            .setEmoji("⬇️")
            .setID("next");

        let buttonRow = new DiscordButtons.MessageActionRow()
            .addComponent(prevBtn)
            .addComponent(nextBtn);

        switch (results[resultIndex].origin) {
            case 'trace' :
                msgObj = {
                    component: includeButtons ? buttonRow : null,
                    embed: traceEmbed(results[resultIndex], other_results, msg),
                };
            break;
            case 'sauce':
                msgObj = {
                    component: includeButtons ? buttonRow : null,
                    embed: sauceEmbed(results[resultIndex], other_results, msg),
                };
            break;
        }

        return msgObj
    }
}