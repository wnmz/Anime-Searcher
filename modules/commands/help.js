const { MessageEmbed } = require("discord.js");

const helpText = {
    ru: {
        description: 'Почему я не могу получить результат поиска?',
        text: `Возможные причины:
        1. Ваше изображение не является скриншотом аниме.
        2. Аниме пока не анализировалось.
        3. Ваше изображение перевернуто.
        4. У вас плохое качество изображения.
        Относительно 1. Вы можете попробовать использовать SauceNAO или iqdb.org, которые лучше всего подходят для поиска иллюстраций аниме.
        Относительно 2. Новые аниме, выходящие в эфир, будут проанализированы примерно через 24 часа после телетрансляции.
        Что касается 3. Если ваше изображение взято из сборников AMV / Anime, скорее всего, оно перевернуто по горизонтали.
        Что касается 4. Алгоритм поиска изображений рассчитан на почти точное совпадение, а не на подобное совпадение. Он анализирует цветовую схему изображения. Таким образом, если ваше изображение не является полностью неотрезанным исходным снимком экрана 16:9 (т.е. Обрезанным изображением), поиск, скорее всего, завершится неудачно.
        Цвет является важным фактором для правильного поиска, если к снимку экрана применяются сильные оттенки и фильтры (например, оттенки серого, контраст, насыщенность, яркость, сепия), теряется слишком много информации. В этом случае поиск также завершится неудачно. Гистограмма краев может решить эту проблему, игнорируя цвета и только края поиска.
        Трансформация изображения также является важным фактором. Если изображение не масштабируется без сохранения исходных соотношений сторон (т. Е. Удлинено, перевернуто, повернуто), поиск также завершится ошибкой.
        Текст занимает слишком много места. Крупный текст на изображении будет мешать исходному изображению. Система недостаточно умна, чтобы игнорировать текст.
        Если ваше изображение имеет слишком мало отличительных черт (например, темные изображения или изображения с большими простыми блоками простых цветов), поиск также завершится ошибкой.
        Искать по реальной фотографии (аниме) точно не получится.`,
        footer: 'Поддержка: https://discord.gg/TMxh6xz'
    },
    en: {
        description: 'Why I can\'t find the search result?',
        text: `Possible reasons:
        1. Your image is not an original anime screenshot.
        2. The anime has not been analyzed yet.
        3. Your image is flipped.
        4. Your image is of bad quality.
        Regarding 1. You may try to use SauceNAO and iqdb.org which is best for searching anime artwork.
        Regarding 2. New animes currently airing would be analyzed around 24 hours after TV broadcast. Long-running animes / cartoons are excluded at this stage.
        As for 3. If you image comes from AMV / Anime Compilations, it's likely its flipped horizontally.
        As for 4. The image search algorithm is designed for almost-exact match, not similar match. It analyze the color layout of the image. So, when your image is not a full un-cropped original 16:9 screenshot (i.e. cropped image), the search would likely fail.
        Color is an important factor for the correct search, if heavy tints and filters are applied to the screenshot (i.e. grayscale, contrast, saturate, brightness, sepia), too much information are lost. In this case the search would also fail. The Edge Histogram can solve this issue by ignoring colors and only search edges. But I am running out of computing resource to support another image descriptor.
        Image transform is also an important factor. If the image is not scaled without maintaining original aspect ratios (i.e. elongated, flipped, rotated), the search would also fail.
        Text occupied too much of the image. Large texts on the image would interfere the original image. The system is not smart enough to ignore the text.
        If you image has too little distinguish features (e.g. dark images or images with large plain blocks of plain colors), the search would also fail.
        Searching with a real photo (of an anime) definitely won't work.`,
        footer: 'Support server: https://discord.gg/TMxh6xz'
    }
}

module.exports = {
    command: 'help',
    description: "help command",
    run: async (client, message) => {
        try {
            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(helpText.en.description+'\n\n'+helpText.en.text)
                .setFooter(helpText.en.footer)
                .setTimestamp()
            message.channel.send(embed).then(mes => {
                Promise.all([
                    mes.react('🇷🇺'),
                    mes.react('🇺🇲')
                ])
                const ruFilter = (reaction, user) => reaction.emoji.name === '🇷🇺' && user.id === message.author.id;
                const enFilter = (reaction, user) => reaction.emoji.name === '🇺🇲' && user.id === message.author.id;
                const ru = mes.createReactionCollector(ruFilter, { time: 60000 }); 
                const um = mes.createReactionCollector(enFilter, { time: 60000 });
                ru.on('collect', r => {
                    embed.setDescription(helpText.ru.description+'\n\n'+helpText.ru.text)
                    embed.setFooter(helpText.ru.footer)
                    mes.edit(embed)
                })
                um.on('collect', r => {
                    embed.setDescription(helpText.en.description+'\n\n'+helpText.en.text)
                    embed.setFooter(helpText.en.footer)
                    mes.edit(embed)
                })
            })
        } finally {
            message.channel.stopTyping();
        }
    }
}