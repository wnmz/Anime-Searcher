# Anime-Searcher
Simple Discord bot that might help you to find anime source by sending the image to https://trace.moe/ and https://saucenao.com/ <br>
___
> Want to invite the bot to your server? <br> https://top.gg/bot/559247918280867848
___
# Installation
1. Install [NodeJS](https://nodejs.org/en/download/) (Version > 16.x)
2. Clone repository: `
git clone https://github.com/wnmz/Anime-Searcher.git
`
3. Install dependencies in project folder: `npm install`

4. Rename file `.env.example` to `.env` and put you environment variables here
    ```
    BOT_TOKEN= ### REQUIRED  
    MONGODB_URI= #### REQUIRED  
    BOT_CLIENT_ID= ### Optional
    TOPGG_TOKEN= ### Optional
    SAUCENAO_TOKEN= ### Optional
    TRACEMOE_TOKEN= ### Optional
    TOPGG_TOKEN= ### Optional
    IMAGE_PROXY_API= ### Optional
        Example: https://mserverexpress.herokuapp.com/api/proxyImage?url=
    IMAGE_PROXY_API_POSTPARAMS= ### Optional
        Example: &width=400&height=225
    ```
5. Start script `npm run start` or `node app.mjs`

# Have no clue what is ImageProxyAPI?
 It's a simple express server that proxy images by urls. It helps the bot to resize images. 
 <br>Repository: https://github.com/wnmz/ImageProxyAPI

# Demo (Old version w/o buttons)
<img src="https://cdn.discordapp.com/attachments/758209391731277829/841300623684665394/output.gif">

<br>

# Questions? Need Help?
Feel free to join our [Discord Server](https://discord.gg/UEYU2nz) or contact me on Discord: **wnm#1663**

<a href="https://discord.gg/UEYU2nz" ><img src="https://img.shields.io/discord/563714260627226635?color=Blue&label=Support%20Server&logo=Discord&style=flat-square"></a>
