import { Logger } from '../logger';
import {
  IBaseProvider,
  IProviderSearchOptions,
} from './interfaces/IBaseProvider';
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

const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';

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
    searchOptions: IProviderSearchOptions
  ): Promise<Array<IProviderSearchResult>> {
    const providers = this.sourceProviders;

    const promises = [...providers]
      .filter(
        provider => this.disabledProviders.includes(provider.name) == false
      )
      .map(provider => provider.search(searchOptions));

    const requests: PromiseSettledResult<IProviderSearchResult>[] =
      await Promise.allSettled(promises);

    const valid = requests.filter(isFulfilled).map(res => res.value);

    return valid;
  }

  public registerProvider(provider: IBaseProvider): void {
    this._logger.info(`Provider has been registered: "${provider.name}"`);
    this.sourceProviders.add(provider);
  }

  private registerDefaultProviders(): void {
    this.registerProvider(
      new TraceMoeProvider({
        api_key: process.env.TRACE_MOE_API_KEY,
      })
    );

    if (process.env.SAUCE_NAO_API_KEY) {
      this.registerProvider(
        new SauceNaoProvider({
          api_key: process.env.SAUCE_NAO_API_KEY,
        })
      );
    }
  }
}
