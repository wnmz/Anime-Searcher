import { AxiosProxyConfig } from 'axios';
import { IProviderSearchResult } from './ISearchResult';

export interface IProviderOptions {
  api_key?: string;
}

export interface IProviderSearchOptions {
  image_url: string;
  max_results: number;
  filter_nsfw: boolean;

  proxy?: AxiosProxyConfig;
}

export interface IBaseProvider {
  name: string;

  search(image_url: IProviderSearchOptions): Promise<IProviderSearchResult>;
}
