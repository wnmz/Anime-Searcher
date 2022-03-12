import SauceNao from './SauceNAO/sauceNAO.mjs';
import TraceMoe from './TraceMOE/traceMOE.mjs';

const {
	SAUCENAO_TOKEN,
	TRACEMOE_TOKEN,
} = process.env;

const engines = [
	new TraceMoe(TRACEMOE_TOKEN),
	new SauceNao(SAUCENAO_TOKEN),
];

export const searchEngineOptions = {
	maxResults: 5,
};

export const searchFilters = {
	includeNSFW: false,
};

export default class SearchEngine {
	constructor(options = searchEngineOptions) {
		this.maxResults = options.maxResults;
	}

	async search(imageURL, filters = searchFilters) {
		let results = [];
		for (const engine of engines) {
			results = [...results, ...(await engine.search(imageURL, filters))];
		}

		return new SearchResultsList(results);
	}
}

export class SearchResultsList {
	constructor(arrayOfResults = []) {
		this._arr = arrayOfResults;
		this._index = -1;
	}

	get current() {
		return this._arr[this._index == -1 ? this._index = 0 : this._index];
	}

	get others() {
		return this._arr.filter((_, ind) => ind != this._index);
	}

	get all() {
		return this._arr;
	}

	get isEmpty() {
		return this._arr.length == 0;
	}

	next() {
		return this._arr[++this._index >= this._arr.length ? this._index = 0 : this._index];
	}

	previous() {
		return this._arr[--this._index < 0 ? this._index = this._arr.length - 1 : this._index];
	}
}