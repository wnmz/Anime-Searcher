import { Logger } from '../logger';
//import { StatsTracker } from '../statistics';
import { IBaseProvider } from './interfaces/IBaseProvider';
import {
  IProviderSearchResult,
  ResultStatus,
} from './interfaces/ISearchResult';
import { SauceNaoProvider } from './saucenao/saucenao';
import { TraceMoeProvider } from './tracemoe/tracemoe';

export interface ISearcherOptions {
  disabled_providers?: Array<string>;
  providers?: Array<IBaseProvider>;
}

export class Searcher {
  private readonly _logger = new Logger('[SEARCH MODULE]');

  public readonly disabledProviders: Array<string> = new Array<string>();
  public readonly sourceProviders: Set<IBaseProvider> = new Set();

  constructor(options: ISearcherOptions) {
    this.registerDefaultProviders();

    this.disabledProviders = options.disabled_providers ?? [];

    options.providers?.forEach(provider => {
      this.registerProvider(provider);
    });
  }

  public async search(
    image_url: string
  ): Promise<Array<IProviderSearchResult>> {
    const providers = this.sourceProviders;
    const results: Array<IProviderSearchResult> = [];

    try {
      for (const provider of providers) {
        if (this.disabledProviders.includes(provider.name)) {
          continue;
        }

        const result: IProviderSearchResult = await provider.search(image_url);

        //StatsTracker.updateProviderStatistic(provider.name, result);

        if (result.status == ResultStatus.STATUS_ERROR) {
          this._logger.warn(
            `Error while searching with provider: "${provider.name}"`
          );
        }

        results.push(result);
      }
    } catch (e: Error | unknown) {
      this._logger.error(e);
    }

    return results;
  }

  public registerProvider(provider: IBaseProvider): void {
    this._logger.info(`Provider has been registered: "${provider.name}"`);
    this.sourceProviders.add(provider);
  }

  private registerDefaultProviders(): void {
    this.registerProvider(
      new TraceMoeProvider({
        api_key: process.env.TRACE_MOE_API_KEY,
        filter_nsfw: false,
        max_results: 10,
      })
    );

    if (process.env.SAUCE_NAO_API_KEY) {
      this.registerProvider(
        new SauceNaoProvider({
          api_key: process.env.SAUCE_NAO_API_KEY,
          filter_nsfw: false,
          max_results: 10,
        })
      );
    }
  }
}
