module.exports = (result, other_results, msg) => {
  const template = {
    author: {
      name: `That's what I've found ฅ^•ﻌ•^ฅ`,
      icon_url: msg.client.user.avatarURL()
    },
    color: 0x00cc4b,
    description: 
        `Title: **${result.title_romaji}**\n` +
        `Similarity: **${(result.similarity * 100).toFixed(2)}%**\n` +
        `Episode: **${(result.episode || 1).toString().padStart(2, "0")}**\n` +
        `Timestamp: **${formatTime(result.from)}**\n` +
        `Anilist: [Click!](https://anilist.co/anime/${result.anilist}/)\n` +
        `Video: [Click!](${result.video})\n` +
        `NSFW: ${result.is_adult ? '**Yes**' : '**No**'}\n`,
    fields: [],
    image: {
      url: result.image
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

  if (other_results.sauce) template.fields = [...template.embed.fields, {
    name: `sauce.nao`,
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