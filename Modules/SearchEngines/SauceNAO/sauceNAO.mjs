/* eslint-disable no-async-promise-executor */
import axios from 'axios';
import SauceNAOResult from './sauceResult.mjs';
const formUrlEncoded = x => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

export default class SauceNao {
	constructor(token) {
		this.token = token;
	}

	search(url, filters = {}) {
		return new Promise(async (resolve) => {
			const data = await this.fetch(url);
			const uniqueResults = this.unique(data);
			const filteredResults = this.filter(uniqueResults, filters);
			const results = this.normalize(filteredResults);
			resolve(results);
		});
	}

	fetch(url) {
		return new Promise(async (resolve) => {
			try {
				if (!this.token) throw Error('Specify a token (sauceNAO)');
				const request = await axios({
					method: 'POST',
					url: 'https://saucenao.com/search.php',
					data: formUrlEncoded({
						api_key: this.token,
						output_type: 2,
						url: url,
						database: 21,
					}),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				});
				if (!request?.data?.results) throw new Error('No Results Found');
				const data = request.data.results;
				resolve(data);
			}
			catch (err) {
				console.error(`[${this.constructor.name}] ${err}`);
				resolve(new Array());
			}
		});
	}

	// TODO: Filters
	filter(results, filters = {}) {
		if (!filters.includeNSFW) results = results.filter(r => !r.is_adult);
		return results;
	}

	unique(results) {
		let sources = [];
		let uniqued = [];
		for (const res of results) {
			if (!sources.includes(res.data.source)) {
				sources = [...sources, res.data.source];
				uniqued = [...uniqued, res];
			}
		}

		return uniqued;
	}

	normalize(results) {
		return results.map(el => {
			el.header.similarity = (el.header.similarity / 100).toFixed(2);
			return new SauceNAOResult({
				origin: 'sauce',
				...el.data,
				...el.header,
			});
		});
	}
}