const axios = require('axios');

const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

class sauceNAO {
    constructor(token) {
        this.token = token;
    }

    search(url) {
        return new Promise(async (resolve, reject) => {
            let [error, data] = await this.fetch(url);
            let uniqueResults = this.unique(data);
            let results = this.normalize(uniqueResults);
            resolve([error, results]);
        });
    }

    fetch(url) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.token) throw Error("Specify a token (sauceNAO)"); 
                let request = await axios({
                    method: 'POST',
                    url: `https://saucenao.com/search.php`,
                    data: formUrlEncoded({
                        api_key: this.token,
                        output_type: 2,
                        url: url,
                        database: 21
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                })
                if (!request?.data?.results) throw new Error("No Results Found");
                let data = request.data.results;
                resolve([null, data]);
            } catch (err) {
                resolve([err, new Array()]);
            }
        });
    }

    unique(results) {
        let sources = [];
        let uniqued = []
        for (let res of results) {
            if (!sources.includes(res.data.source)) {
                sources = [...sources, res.data.source];
                uniqued = [...uniqued, res]
            }
        }

        return uniqued;
    }

    normalize(results) {
        return results.map(el => {
            el.header.similarity = el.header.similarity / 100;
            return Object.assign({ origin: 'sauce' }, el.data, el.header);
        });
    }
}

module.exports = sauceNAO;