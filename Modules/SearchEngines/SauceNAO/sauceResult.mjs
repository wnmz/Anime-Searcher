import { CommonEngineMethods } from '../common.mjs';

export default class SauceNAOResult {
	constructor(data = {}) {
		this.data = data;
	}

	toEmbed(msg, resultList) {
		const imageURL = process.env.IMAGE_PROXY_API ?
			process.env.IMAGE_PROXY_API + encodeURIComponent(this.data.thumbnail) + process.env.IMAGE_PROXY_API_POSTPARAMS :
			this.data.thumbnail;
		const template = {
			author: {
				name: 'That\'s what I\'ve found ฅ^•ﻌ•^ฅ',
				icon_url: msg.client.user?.avatarURL() ,
			},
			color: 0x00cc4b,
			description:
				`Title: **${this.data.source}**\n` +
				`Similarity: **${(this.data.similarity * 100).toFixed(2)}%**\n` +
				`Episode: **${this.data.part}**\n` +
				`Timestamp: **${this.data.est_time.split(' / ')[0]}**\n` +
				`Year: **${this.data.year}**\n` +
				`AniDB: [Click!](https://anidb.net/anime/${this.data.anidb_aid})\n`,
			fields: CommonEngineMethods.formEmbedFields(this.data, resultList),
			image: {
				url: imageURL,
			},
			footer: {
				icon_url: msg?.author?.avatarURL() ?? msg.user?.avatarURL() ?? 'https://discord.com/assets/2d20a45d79110dc5bf947137e9d99b66.svg',
				text: `Requested by ${msg?.author?.username ?? msg.user.tag}, Author: wnm#1663`,
			},
		};

		return template;
	}
}