const axios = require('axios')
const anilist = require('anilist-node');
const Anilist = new anilist();

class TraceMoe {
    constructor(token) {
        this.token = token;
    }

    async search(imageURL) {
        let result = await this.fetch(imageURL);
        result = this.unique(result);
        await this.assignAnimeInfo(result);
        this.assignElementsOrigin(result);
        return result;
    }

    fetch(imageURL) {
        return new Promise(async (resolve, reject) => {
            try {
                let request = await axios({
                    method: 'POST',
                    url: `https://api.trace.moe/search?url=${imageURL}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                });
                this.getAnimeInfo(request.data.result[0].anilist);
                resolve(request?.data?.result ?? []);
            } catch (err) {
                console.error(err);
                resolve([]);
            }
        })
    }

    unique(results) {
        let anilistIDs = [];
        let uniqued = [];
        for (let x of results) {
            if (!anilistIDs.includes(x.anilist)) {
                anilistIDs = [...anilistIDs, x.anilist];
                uniqued = [...uniqued, x];
            }
        }

        uniqued.sort((a, b) => b.similarity - a.similarity)
        return uniqued;
    }

    assignElementsOrigin(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].origin = 'trace';
        }
    }

    async getAnimeInfo(anilistID) {
            let data = await Anilist.media.anime(anilistID);
            let info = {
                title_romaji: data?.title?.romaji,
                title_english: data?.title?.english,
                is_adult: data?.isAdult
            }
            return info;
    }

    async assignAnimeInfo(items) {
        for (let i = 0; i < items.length; i++) {
            let animeInfo = await this.getAnimeInfo(items[i].anilist);
            Object.assign(items[i], animeInfo);
        }
    }
}

module.exports = TraceMoe;