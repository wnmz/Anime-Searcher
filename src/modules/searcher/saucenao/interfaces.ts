import { IResult } from '../interfaces/ISearchResult';

interface SauceNaoHeader {
  account_type: string;
  long_limit: string;
  long_remaining: number;
  minimum_similarity: number;
  query_image: string;
  query_image_display: string;
  results_requested: string;
  results_returned: number;
  search_depth: string;
  short_limit: string;
  short_remaining: number;
  status: number;
  user_id: string;
}

interface SauceNaoResultData extends IResult {
  ext_urls: string[];
  source: string;
  anidb_aid: number;
  mal_id: number;
  anilist_id: number;
  part: string;
  year: string;
  est_time: string;
}

interface SauceNaoResultHeader extends IResult {
  similarity: string;
  thumbnail: string;
  index_id: number;
  index_name: string;
  dupes: number;
  // Add other properties as needed
}
interface SauceNaoInternalResult {
  header: SauceNaoResultHeader;
  data: SauceNaoResultData;
}

export interface SauceNaoResult {
  header: SauceNaoHeader;
  results: Array<SauceNaoInternalResult>;
}
