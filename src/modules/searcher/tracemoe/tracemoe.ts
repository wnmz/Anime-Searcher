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
import { TraceMoeSearchResponse } from './interfaces';

export class TraceMoeProvider implements IBaseProvider {
  private readonly _logger: Logger;
  public readonly options: IProviderOptions;
  public readonly name: string;
  public readonly BASE_URL: string = 'https://api.trace.moe/';

  constructor(options: IProviderOptions) {
    this.name = 'trace.moe';
    this.options = options;

    this._logger = new Logger(this.name);
  }

  public async search(
    searchOptions: IProviderSearchOptions
  ): Promise<IProviderSearchResult> {
    const searchResult: IProviderSearchResult = {
      providerName: this.name,
      data: [],
      status: ResultStatus.STATUS_OK,
      statusCode: 200,
    };

    try {
      const response = await this.fetch(searchOptions);
      const data = response.data as TraceMoeSearchResponse;
      if (data.error) {
        searchResult.status = ResultStatus.STATUS_ERROR;
        searchResult.errorMessage = data.error;

        return searchResult;
      }

      searchResult.data = data.result;
      searchResult.statusCode = response.status;
    } catch (e: Error | unknown) {
      searchResult.status = ResultStatus.STATUS_ERROR;

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

  private fetch(searchOptions: IProviderSearchOptions): Promise<AxiosResponse> {
    return axios.get(this.BASE_URL + 'search', {
      method: 'GET',
      params: {
        anilistInfo: true,
        // cutBorders: true, [disabled causes request to be 2x times slower]
        url: searchOptions.image_url,
      },
      proxy: searchOptions.proxy,
    });
  }
}
