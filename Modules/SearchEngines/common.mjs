export const CommonEngineMethods = {
	formEmbedFields(current, resultList) {
		const traceResults = resultList.all.filter(r => r.data.origin == 'trace');
		const sauceResults = resultList.all.filter(r => r.data.origin == 'sauce');

		let fields = [{
			name: 'trace.moe',
			value: traceResults.length ?
				traceResults
					.map(r => {
						const isCurrent = r == resultList.current;
						const title = r.data.title_english || r.data.title_romaji;
						return `${isCurrent ? '👉 ' : ''}[${title}](https://anilist.co/anime/${r.anilist}/)`;
					})
					.join('\n')
				: 'All results were NSFW(18+), try searching in NSFW channel.',
		}];

		if (sauceResults.length !== 0) {
			fields = [...fields,
				{
					name: 'saucenao.com',
					value: sauceResults.map(r => {
						const isCurrent = r == resultList.current;
						return `${isCurrent ? '👉 ' : ''}[${r.data.source}](https://anidb.net/anime/${r.data.anidb_aid})`;
					}).join('\n'),
				}];
		}

		return fields;
	},
};