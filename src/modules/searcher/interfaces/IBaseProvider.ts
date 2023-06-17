import { IProviderSearchResult } from './ISearchResult';

export interface IProviderOptions {
  api_key?: string;
  max_results?: number;
  filter_nsfw?: boolean;
}

export interface IBaseProvider {
  name: string;

  search(image_url: string): Promise<IProviderSearchResult>;
}
