import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { IBaseInteraction } from './IBaseInteraction';
import { searchIneraction } from './search.interaction';
import { Logger } from '../../modules/logger';

export class InteractionManager {
  private readonly interactionMap = new Map<string, IBaseInteraction>();
  private readonly logger = new Logger('[INTERACTION MANAGER]');

  public constructor() {
    this.addDefaultInteractions();
  }

  private addDefaultInteractions(): void {
    this.interactionMap.set(searchIneraction.name, searchIneraction);
  }

  public getInteractions(): Map<string, IBaseInteraction> {
    return this.interactionMap;
  }

  public async registerInteractions(): Promise<boolean> {
    if (!process.env.DISCORD_BOT_CLIENT_ID) {
      this.logger.warn(
        'DISCORD_BOT_CLIENT_ID is undefined, skipping interaction registration.'
      );
      return false;
    }

    const jsonCommands: unknown[] = [];

    for (const interaction of this.interactionMap.values()) {
      const interactionBuilders = interaction
        .getBuilders()
        .map(builder => builder.toJSON());

      jsonCommands.push(...interactionBuilders);
    }

    try {
      const rest = new REST({ version: '10' }).setToken(
        process.env.DISCORD_BOT_TOKEN
      );

      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID),
        {
          body: jsonCommands,
        }
      );

      this.logger.info('Successfully registered application commands.');
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }
}
