const axios = require('axios')

class TraceMoe {
    constructor(token) {
        this.token = token;
    }

    async search(imgBase64) {
        return new Promise(async (resolve, reject) => {
            try {
                let token = this.token ? '?token=' + this.token : ''
                let request = await axios({
                    method: 'POST',
                    url: `https://trace.moe/api/search${token}`,
                    data: {
                        image: imgBase64
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                })
                let result = request.data;
                if (!result.limit || !result.docs.length) resolve([]);
                let data = this.unique(result.docs)
                    .map(el => {
                        el.from = 'trace'
                        return el;   
                    });
                
                resolve(data);
            } catch (err) {
                reject(err)
            }
        })
    }

    unique(results) {
        let titleNames = [];
        let uniqued = []
        for(let res of results) {
            if (!titleNames.includes(res.title_english)) {
                titleNames = [...titleNames, res.title_english];
                uniqued = [...uniqued, res]
            }
        }
        
        uniqued.sort((a, b) => {
            return b.similarity - a.similarity;
        })
        return uniqued
    }
}

module.exports = TraceMoe;