/* eslint-disable no-async-promise-executor */
import axios from 'axios';
import anilist from 'anilist-node';
const Anilist = new anilist();
import TraceMOEResult from './traceResult.mjs';

export default class TraceMoe {
	constructor(token) {
		this.token = token;
	}

	search(imageURL, filters = {}) {
		return new Promise(async (resolve) => {
			// eslint-disable-next-line prefer-const
			const result = await this.fetch(imageURL);
			const uniquedResults = this.uniqueAndSort(result);
			await this.assignAnimeInfo(uniquedResults);
			const filteredResults = this.filter(uniquedResults, filters);
			this.assignElementsOrigin(filteredResults);
			resolve(filteredResults.map(res => new TraceMOEResult(res)));
		});

	}

	fetch(imageURL) {
		return new Promise(async (resolve) => {
			try {
				const request = await axios({
					method: 'POST',
					url: `https://api.trace.moe/search?url=${encodeURIComponent(imageURL)}`,
					headers: {
						'Content-Type': 'application/json',
					},
				});
				resolve(request?.data?.result ?? []);
			}
			catch (err) {
				console.error(`[${this.constructor.name}] ${err}`);
				resolve([]);
			}
		});
	}

	uniqueAndSort(results) {
		let anilistIDs = [];
		let uniqued = [];
		for (const x of results) {
			if (!anilistIDs.includes(x.anilist)) {
				anilistIDs = [...anilistIDs, x.anilist];
				uniqued = [...uniqued, x];
			}
		}

		uniqued.sort((a, b) => b.similarity - a.similarity);
		return uniqued;
	}

	filter(results, filters = {}) {
		if (!filters.includeNSFW) results = results.filter(r => !r.is_adult);
		return results;
	}

	assignElementsOrigin(items) {
		for (let i = 0; i < items.length; i++) {
			items[i].origin = 'trace';
		}
	}

	async getAnimeInfo(anilistID) {
		const data = await Anilist.media.anime(anilistID);
		const info = {
			title_romaji: data?.title?.romaji,
			title_english: data?.title?.english,
			is_adult: data?.isAdult,
		};
		return info;
	}

	async assignAnimeInfo(items) {
		for (let i = 0; i < items.length; i++) {
			const animeInfo = await this.getAnimeInfo(items[i].anilist);
			items[i] = { ...items[i], ...animeInfo };
		}
	}
}