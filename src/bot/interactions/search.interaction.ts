import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { IBaseInteraction, InteractionBuilders } from './IBaseInteraction';
import { DiscordBotClient } from '../Client';
import { Searcher } from '../../modules/searcher/searcher';

export const searchIneraction: IBaseInteraction = {
  name: 'search',
  description: 'Provide URL or attach an image to search for its source',
  getBuilders: function (): InteractionBuilders[] {
    const slashCommandBuilder = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addAttachmentOption(option =>
        option
          .setName('file')
          .setDescription(
            'Specify the image attachment for which you want to find the source.'
          )
          .setRequired(false)
      )
      .addStringOption(option =>
        option
          .setName('url')
          .setDescription(
            'Specify the image URL for which you want to find the source.'
          )
          .setRequired(false)
      );

    const contextMenuCommandBuilder = new ContextMenuCommandBuilder()
      .setName(this.name)
      .setType(ApplicationCommandType.Message)
      .setDMPermission(false);

    return [slashCommandBuilder, contextMenuCommandBuilder];
  },
  execute: async (
    client: DiscordBotClient,
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction
  ) => {
    let imageURL: string | undefined = '';
    const urlCheckRegExp = new RegExp(
      // eslint-disable-next-line no-useless-escape
      /((https?|ftp):\/\/)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}|([0-9]{1,3}\.){3}[0-9]{1,3})(:[0-9]{1,5})?(\/([^\s]*[^\s\.])?)?(\/?[a-zA-Z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~])*(\/([^\s]*[^\s\.])?)?(\?[a-zA-Z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~])?/gi
    );

    await interaction.deferReply();

    if (interaction instanceof ChatInputCommandInteraction) {
      imageURL =
        interaction.options.getAttachment('file')?.url ||
        interaction.options.getString('url')?.match(urlCheckRegExp)?.shift() ||
        undefined;
    }

    if (interaction instanceof ContextMenuCommandInteraction) {
      const message = interaction.options.getMessage('message');
      imageURL =
        message?.attachments?.first()?.url ||
        message?.content?.match(urlCheckRegExp)?.shift() ||
        undefined;
    }

    if (!imageURL) {
      await interaction.reply({
        content: 'Image not found ¯\\_(ツ)_/¯',
        ephemeral: true,
      });
      return;
    }

    const searcher: Searcher = new Searcher({});
    const results = await searcher.search({
      image_url: imageURL,
      max_results: 10,
      filter_nsfw: false,
    });

    console.log(results);

    await interaction.reply(imageURL ?? 'error');
  },
};
