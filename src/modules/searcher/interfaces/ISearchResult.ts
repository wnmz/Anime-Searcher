export enum ResultStatus {
  STATUS_OK,
  STATUS_ERROR,
}

export interface IProviderSearchResult {
  providerName: string;
  status: ResultStatus;
  statusCode: number | undefined;
  errorMessage?: string;
  data: Array<IResult>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResult {}
