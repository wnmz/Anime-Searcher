const axios = require('axios')

class TraceMoe {
    constructor(token) {
        this.token = token;
    }

    async getImageBase64(url) {
        return new Promise(async (resolve, reject) => {
            try {
                let image = await axios.get(url, {
                    responseType: 'arraybuffer'
                });
                let returnedB64 = Buffer.from(image.data, 'binary').toString('base64');
                resolve(returnedB64)
            } catch (err) {
                reject(err)
            }
        })
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
                    }
                })
                let result = request.data;
                if (!result.limit || !result.docs.length) return reject('rate limit');
                resolve(this.sortAndUnique(result));
            } catch (err) {
                reject(err)
            }
        })
    }

    sortAndUnique(result) {
        let titleNames = [];
        let uniqued = []
        result.docs.map(e => {
            if (!titleNames.includes(e.title_english)) {
                titleNames = [...titleNames, e.title_english];
                uniqued = [...uniqued, e]
            }
        })
        uniqued.sort((a, b) => {
            return b.similarity - a.similarity
        })
        result.docs = uniqued;
        return result
    }
}

module.exports = TraceMoe;