// API response types and data transfer objects

import type { AvsData } from './domain';

// API Response types
export interface ApiResponseData<T = any> {
  id: string;
  type: string;
  attributes: T;
}

export interface ApiResponse<T = any> {
  data: ApiResponseData<T>;
}

export interface AvsApiResponse extends ApiResponse<AvsData> {
  data: ApiResponseData<AvsData>;
}

// Loader return type
export interface AvsLoaderData {
  avs: AvsData;
}