import { CommonEngineMethods } from '../common.mjs';

export default class TraceMOEResult {
	constructor(data = {}) {
		this.data = data;
	}

	toEmbed(msg, resultList) {
		const imageURL = process.env.IMAGE_PROXY_API ?
			process.env.IMAGE_PROXY_API + encodeURIComponent(this.data.image) :
			this.data.image;

		const template = {
			author: {
				name: 'That\'s what I\'ve found ฅ^•ﻌ•^ฅ',
				icon_url: msg.client.user.avatarURL(),
			},
			color: 0x00cc4b,
			description:
				`Title: **${this.data.title_romaji}**\n` +
				`Similarity: **${(this.data.similarity * 100).toFixed(2)}%**\n` +
				`Episode: **${(this.data.episode || 1).toString().padStart(2, '0')}**\n` +
				`Timestamp: **${formatTime(this.data.from)}**\n` +
				`Anilist: [Click!](https://anilist.co/anime/${this.data.anilist}/)\n` +
				`Video: [Click!](${this.data.video})\n` +
				`NSFW: ${this.data.is_adult ? '**Yes**' : '**No**'}\n`,
			fields: CommonEngineMethods.formEmbedFields(this.data, resultList),
			image: {
				url: imageURL,
			},
			footer: {
				icon_url: msg?.author?.avatarURL() ?? msg?.user?.avatarURL() ?? 'https://discord.com/assets/2d20a45d79110dc5bf947137e9d99b66.svg',
				text: `Requested by ${msg?.author?.username ?? msg.user.tag}, Author: wnm#1663`,
			},
		};

		return template;
	}
}

const formatTime = timeInSeconds => {
	const sec_num = parseInt(timeInSeconds, 10);
	const hours = Math.floor(sec_num / 3600)
		.toString()
		.padStart(2, '0');
	const minutes = Math.floor((sec_num - hours * 3600) / 60)
		.toString()
		.padStart(2, '0');
	const seconds = (sec_num - hours * 3600 - minutes * 60)
		.toString()
		.padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
};