const {
    MessageActionRow,
    MessageButton
} = require('discord.js');

//const axios = require('axios')
const traceEmbed = require('./Embeds/traceEmbed');
const sauceEmbed = require('./Embeds/sauceEmbed');

module.exports = {
    // getImageBase64(url) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let image = await axios.get(url, {
    //                 responseType: 'arraybuffer'
    //             });
    //             let returnedB64 = Buffer.from(image.data, 'binary').toString('base64');
    //             resolve(returnedB64)
    //         } catch (err) {
    //             reject(err)
    //         }
    //     })
    // },

    stringifyResults(results, resultIndex) {
        let resultsObj = {
            trace: '',
            sauce: '',
        };

        results.forEach((r, i) => {
            switch(r.origin) {
                case 'trace':
                    resultsObj.trace += `${i == resultIndex ? '👉 ' : ''}[${r.title_english || r.title_romaji}](https://anilist.co/anime/${r.anilist}/)\n`
                break;
                case 'sauce':
                    resultsObj.sauce += `${i == resultIndex ? '👉 ' : ''}[${r.source}](https://anidb.net/anime/${r.anidb_aid})\n`
                break;
            }
        });
        return resultsObj;
    },

    formResultEmbed(msg, results, resultIndex, other_results, isDisabled = false) {
        let embed = {};

        let prevBtn = new MessageButton()
            .setCustomId("up")
            .setLabel("Up")
            .setStyle("SUCCESS")
            .setEmoji("⬆️")
            .setDisabled(isDisabled)

        let nextBtn = new MessageButton()
            .setCustomId("down")
            .setLabel("Down")
            .setStyle("SUCCESS")
            .setEmoji("⬇️")
            .setDisabled(isDisabled)

        let inviteBtn = new MessageButton()
            .setLabel("Invite Bot")
            .setURL("https://discord.com/oauth2/authorize?client_id=559247918280867848&scope=bot&permissions=52288")
            .setStyle("LINK")

        // let patreonBtn = new DiscordButtons.MessageButton()
        //     .setStyle("url")
        //     .setEmoji("❤️")
        //     .setLabel("Patreon")
        //     .setURL("https://www.patreon.com/animesearcher")

        let buttonRow = new MessageActionRow()
            .addComponents(prevBtn, nextBtn, inviteBtn);

        switch (results[resultIndex].origin) {
            case 'trace':
                embed = {
                    components: [ buttonRow ],
                    embeds: [ traceEmbed(results[resultIndex], other_results, msg) ],
                };
                break;
            case 'sauce':
                embed = {
                    components: [ buttonRow ],
                    embeds: [ sauceEmbed(results[resultIndex], other_results, msg) ],
                };
                break;
        }

        return embed;
    }
}