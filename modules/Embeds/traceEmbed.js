module.exports = (result, other_results, msg) => {
  let video_url = `https://media.trace.moe/video/${result.anilist_id}/${encodeURIComponent(result.filename)}?t=${result.at}&token=${result.tokenthumb}&size=l`.replace(/[)]/g, '%29')
  const template = {
    embed: {
      author: {
        name: `That's what I've found ฅ^•ﻌ•^ฅ`,
        icon_url: msg.client.user.avatarURL()
      },
      color: 0x00cc4b,
      description:
        `Title: **${result.title_romaji}**\n` +
        `Similarity: **${(result.similarity * 100).toFixed(2)}%**\n` +
        `Episode: **${(result.episode || 1).toString().padStart(2, "0")}**\n` +
        `Timestamp: **${formatTime(result.at)}**\n` +
        `MyAnimeList: [Click!](https://myanimelist.net/anime/${result.mal_id})\n` +
        `Video: [Click!](${video_url})\n` +
        `NSFW: ${result.is_adult ? '**Yes! Yes! Yes!**' : '**No 😫**'}\n`,
      fields: [],
      image: {
        url: `https://media.trace.moe/image/${result.anilist_id}/${encodeURIComponent(result.filename)}?t=${result.at}&token=${result.tokenthumb}&size=m`
      },
      footer: {
        icon_url: msg.author.avatarURL(),
        text: `Requested by ${msg.author.username}, Author: wnm#1663`
      }
    }
  }


  if (other_results.trace) template.embed.fields = [{
    name: `<:TraceMOE:793147256994791435> trace.moe`,
    value: other_results.trace ? other_results.trace : `No Results! ${msg.channel.nsfw ? `` : `Try searching in NSFW channel.`}`,
  }]

  if (other_results.sauce) template.embed.fields = [...template.embed.fields, {
    name: `<:SauceNAO:793147203035070495> sauce.nao`,
    value: other_results.sauce ? other_results.sauce : `No Results!`,
  }]
  return template;
}



const formatTime = timeInSeconds => {
  const sec_num = parseInt(timeInSeconds, 10);
  const hours = Math.floor(sec_num / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((sec_num - hours * 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (sec_num - hours * 3600 - minutes * 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};