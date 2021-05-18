const axios = require('axios')
// const Canvas = require('canvas');
// const Discord = require('discord.js');

module.exports = {
    getImageBase64(url) {
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
    },

    formOtherResults(results, resultIndex) {
        let otherResults = {
            trace: '',
            sauce: '',
        };

        for (let i = 0; i < results.length; i++) {
            let r = results[i];
            if (r.origin == 'trace') {
                otherResults.trace += `${i == resultIndex ? '👉 ' : ''}[${r.title_english || r.title_romaji}](https://anilist.co/anime/${r.anilist}/)\n`
            } else {
                otherResults.sauce += `${i == resultIndex ? '👉 ' : ''}[${r.source}](https://anidb.net/anime/${r.anidb_aid})\n`
            }
        }
        return otherResults;
    },

    //Resizing is still in WIP

    // resizeImage(imageURL, index) { //Resize lowres sauceNao Image to fit in discord embed (320x200)
    //     return new Promise(async(resolve, reject) => {
    //         const canvas = Canvas.createCanvas(320, 200);
    //         const ctx = canvas.getContext('2d');
    //         const image = await Canvas.loadImage(imageURL);
    //         ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    //         const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `image${index}.png`);
    //         resolve(attachment); 
    //     })
    // }
}