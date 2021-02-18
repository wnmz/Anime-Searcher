const axios = require('axios')

class TraceMoe {
    constructor(token) {
        this.token = token;
    }

    async search(imageURL) {
        return new Promise(async (resolve, reject) => {
            try {
                let token = this.token ? '?token=' + this.token : ''
                let request = await axios({
                    method: 'POST',
                    url: `https://trace.moe/api/search?url=${imageURL}${token}`,
                    // data: { 
                    //     image: imgBase64
                    // },
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
                console.error(err);
                resolve([]);
            }
        })
    }

    unique(results) {
        let titleNames = [];
        let uniqued = []
        for(let res of results) {
            if (!titleNames.includes(res.title_english || res.title_romaji)) {
                titleNames = [...titleNames, ( res.title_english || res.title_romaji )];
                uniqued = [...uniqued, res]
            }
        }
        
        uniqued.sort((a, b) => b.similarity - a.similarity)
        return uniqued
    }
}

module.exports = TraceMoe;