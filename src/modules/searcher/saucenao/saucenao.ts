import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  IBaseProvider,
  IProviderOptions,
  IProviderSearchOptions,
} from '../interfaces/IBaseProvider';
import {
  IProviderSearchResult,
  ResultStatus,
} from '../interfaces/ISearchResult';
import { Logger } from '../../logger';
import { SauceNaoResult } from './interfaces';

export interface ISauceNaoProviderOptions extends IProviderOptions {
  api_key: string;
}

export class SauceNaoProvider implements IBaseProvider {
  private readonly _logger: Logger;

  public readonly name: string;
  public readonly BASE_URL: string;
  public readonly options: ISauceNaoProviderOptions;

  constructor(options: ISauceNaoProviderOptions) {
    this.name = 'sauce.nao';
    this.BASE_URL = 'https://saucenao.com/search.php';
    this.options = options;

    this._logger = new Logger(this.name);
  }

  async search(
    searchOptions: IProviderSearchOptions
  ): Promise<IProviderSearchResult> {
    const searchResult: IProviderSearchResult = {
      providerName: this.name,
      status: ResultStatus.STATUS_OK,
      statusCode: 200,
      data: [],
    };

    try {
      const response = await this.fetch(searchOptions);
      const data = response.data as SauceNaoResult;

      searchResult.data = data.results;
      searchResult.statusCode = response.status;
    } catch (e: Error | unknown) {
      if (e instanceof AxiosError) {
        searchResult.errorMessage = e.message;
        searchResult.statusCode = e.response?.status ?? -1;
        this._logger.error(e.message);
      } else {
        searchResult.errorMessage = 'An unknown error occurred.';
        searchResult.statusCode = -1;
        this._logger.error('Unknown error:', e);
      }
    }

    return searchResult;
  }

  fetch(searchOptions: IProviderSearchOptions): Promise<AxiosResponse> {
    const params = new URLSearchParams();
    params.append('api_key', this.options.api_key);
    params.append('output_type', '2');
    params.append('url', searchOptions.image_url);
    params.append('database', '21');
    params.append('hide', searchOptions.filter_nsfw ? '2' : '0');

    return axios.post(this.BASE_URL, params.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      proxy: searchOptions.proxy,
    });
  }
}
