import {
  Client,
  ClientOptions,
  Events,
  GatewayIntentBits,
  Interaction,
} from 'discord.js';
import { IBaseInteraction } from './interactions/IBaseInteraction';
import { InteractionManager } from './interactions/interactionManager';
import { Logger } from '../modules/logger';

const clientOptions: ClientOptions = {
  intents: [GatewayIntentBits.Guilds],
};

export class DiscordBotClient extends Client {
  public interactions: Map<string, IBaseInteraction>;
  public logger: Logger = new Logger('[DiscordBotClient]');

  constructor() {
    super(clientOptions);
    this.interactions = new InteractionManager().getInteractions();

    new InteractionManager().registerInteractions();
    this.bindEvents();
  }

  private bindEvents() {
    this.on(Events.ClientReady, () => {
      this.logger.info(`Logged in as ${this?.user?.tag}!`);
    });

    this.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (
        !interaction.isCommand() &&
        !interaction.isMessageContextMenuCommand()
      )
        return;

      const command = this.interactions.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(this, interaction);
      } catch (error: Error | unknown) {
        this.logger.error(error);
      }
    });
  }
}
