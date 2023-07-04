import { ContextMenuCommandBuilder, SlashCommandBuilder } from 'discord.js';
import { DiscordBotClient } from '../Client';

// Just SlashCommandBuilder doesn't work thx discord.js ;d
export type InteractionBuilders =
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  | ContextMenuCommandBuilder;

export interface IBaseInteraction {
  name: string;
  description: string;
  getBuilders: () => InteractionBuilders[];
  execute: (
    client: DiscordBotClient,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interaction: any
  ) => Promise<void>;
}
