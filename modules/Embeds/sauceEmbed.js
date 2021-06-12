module.exports = (result, other_results, msg) => {
    const template = {
        author: {
            name: `That's what I've found ฅ^•ﻌ•^ฅ`,
            icon_url: msg.client.user.avatarURL()
        },
        color: 0x00cc4b,
        description: 
            `Title: **${result.source}**\n` +
            `Similarity: **${(result.similarity * 100).toFixed(2)}%**\n` +
            `Episode: **${result.part}**\n` +
            `Timestamp: **${result.est_time.split(' / ')[0]}**\n` +
            `Year: **${result.year}**\n` +
            `AniDB: [Click!](https://anidb.net/anime/${result.anidb_aid})\n`,
        fields: [],
        image: {
            url: result.thumbnail
        },
        footer: {
            icon_url: msg.author.avatarURL(),
            text: `Requested by ${msg.author.username}, Author: wnm#1663`
        }
    }

    if (other_results.trace) template.fields = [{
        name: `trace.moe`,
        value: other_results.trace ? other_results.trace : `No Results! ${msg.channel.nsfw ? `` : `Try searching in NSFW channel.`}`,
    }]

    if (other_results.sauce) template.fields = [...template.fields, {
        name: `sauce.nao`,
        value: other_results.sauce ? other_results.sauce : `No Results!`,
    }]

    return template;
}