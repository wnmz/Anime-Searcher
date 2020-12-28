module.exports = (result, other_results, msg) => {
  let video_url = `https://media.trace.moe/video/${result.anilist_id}/${encodeURIComponent(result.filename)}?t=${result.at}&token=${result.tokenthumb}`.replace(/[)]/g, '%29')

  return {
    embed: {
      title: `🎅 That's what I've found ฅ^•ﻌ•^ฅ`,
      color: 0x00cc4b,
      footer: {
        icon_url: msg.author.avatarURL(),
        text: `Requested by ${msg.author.username}, Author: wnm#1663`
      },
      description: 
        `Title: **${result.title_romaji}**\n` +
        `Similarity: **${(result.similarity * 100).toFixed(2)}%**\n` +
        `Episode: **${result.episode.toString().padStart(2, "0")}**\n` +
        `Timestamp: **${formatTime(result.at)}**\n` +
        `MyAnimeList: [Click!](https://myanimelist.net/anime/${result.mal_id})\n` +
        `Video: [Click!](${video_url})\n` +
        `NSFW: ${result.is_adult ? '**Yes! Yes! Yes!**' : '**No 😫**'}\n`,
      image: {
        url: `https://trace.moe/thumbnail.php?anilist_id=${result.anilist_id}&file=${encodeURIComponent(result.filename)}&t=${result.at}&token=${result.tokenthumb}`
      },
      fields: [
        {
          name: `<:TraceMOE:793147256994791435> trace.moe`,
          value: other_results.trace,
        },
        {
          name: `<:SauceNAO:793147203035070495> sauce.nao`,
          value: other_results.sauce,
        }
      ]
    }
  }
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