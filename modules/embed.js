module.exports = (docs, index, msg) => {
  let result = docs[index];
  let video_url = `https://media.trace.moe/video/${result.anilist_id}/${encodeURIComponent(result.filename)}?t=${result.at}&token=${result.tokenthumb}`.replace(/[)]/g, '%29')
  let containsNSFW = docs.filter(doc => doc.is_adult).length ? true : false;
  
  return {
    title: `That's what I've found ฅ^•ﻌ•^ฅ`,
    color: 7589871,
    footer: {
      icon_url: msg.author.avatarURL(),
      text: `Requested by ${msg.author.username}, Author: wnm#1663`
    },
    // thumbnail: {
    //     url: `https://trace.moe/thumbnail.php?anilist_id=${result.anilist_id}&file=${encodeURIComponent(result.filename)}&t=${result.at}&token=${result.tokenthumb}`
    // },
    description: `Anime: **${result.title_romaji}**\n` +
      `Similarity: **${result.similarity.toFixed(4) * 100}%**\n` +
      `Episode: **${result.episode.toString().padStart(2, "0")}**\n` +
      `Timestamp: **${formatTime(result.at)}**\n` +
      `MyAnimeList: [Click!](https://myanimelist.net/anime/${result.mal_id})\n` +
      `Video: [Click!](${video_url})\n` +
      `NSFW: ${result.is_adult ? '**Yes! Yes! Yes!**' : '**No 😫**'}\n` +
      `Support Developer: [Patreon](https://www.patreon.com/wnm)\n` +
      `${!msg.channel.nsfw && containsNSFW ? '```\nNSFW results were removed because this channel is not suitable for this content.```' : ''}`,
    image: {
      url: `https://trace.moe/thumbnail.php?anilist_id=${result.anilist_id}&file=${encodeURIComponent(result.filename)}&t=${result.at}&token=${result.tokenthumb}`
    },
    fields: [{
      name: "Other results:",
      value: `${docs.map((e,i)=>{
                return `[${index == i ? '👉 ' + e.title_english : e.title_englishindex == i ? '👉' + e.title_english : e.title_english}](https://myanimelist.net/anime/${result.mal_id}})`
            }).join('\n')}`
    }]
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