import { IResult } from '../interfaces/ISearchResult';

interface SearchResult extends IResult {
  anilist: number | AnilistInfo;
  filename: string;
  episode: number | null;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
}

interface AnilistInfo {
  id: number;
  idMal: number;
  title: {
    native: string;
    romaji: string;
    english?: string;
  };
  synonyms: string[];
  isAdult: boolean;
}

export interface TraceMoeSearchResponse {
  frameCount?: number;
  error: string | null;
  result: SearchResult[];
}
