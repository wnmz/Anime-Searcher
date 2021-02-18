const axios = require('axios');

const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

module.exports = class sauceNAO {
    constructor(token) {
        this.token = token;
    }

    search(url) {
        return new Promise(async (resolve, reject) => {
            try {
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
                if (!request?.data?.results) resolve([]);
                let data = this.unique(request.data.results)
                    .map(el => {
                        el.header.similarity = el.header.similarity / 100
                        return Object.assign({from: 'sauce'}, el.data, el.header);
                    });
                resolve(data);
            } catch (err) {
                console.error(err);
                resolve([]);
            }
        })

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
}