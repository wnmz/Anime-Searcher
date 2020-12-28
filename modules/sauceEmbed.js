const { resizeImage } = require('./utils');

module.exports = async (result, other_results, msg) => {

    return {
        // files: [attachments[resultIndex]],
        embed: {
            title: `🎅 That's what I've found ฅ^•ﻌ•^ฅ`,
            color: 0x00cc4b,
            description: 
                `Title: **${result.source}**\n` +
                `Similarity: **${(result.similarity * 100).toFixed(2)}%**\n` +
                `Episode: **${result.part}**\n` +
                `Timestamp: **${result.est_time.split(' / ')[0]}**\n` +
                `Year: **${result.year}**\n` +
                `AniDB: [Click!](https://anidb.net/anime/${result.anidb_aid})\n`,
            fields: [
                {
                    name: `<:traceMOE:792752572439855125> trace.moe`,
                    value: other_results.trace,
                },
                {
                    name: `<:SauceNAO:792751898679312425> sauce.nao`,
                    value: other_results.sauce,
                }
            ],
            image: {
                url: result.thumbnail
            },
            footer: {
                icon_url: msg.author.avatarURL(),
                text: `Requested by ${msg.author.username}, Author: wnm#1663`
            }
        }
    }
}