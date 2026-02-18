// API response types and data transfer objects

import type { AvsData } from './domain';

// API Response types
export interface AvsApiResponseData {
  id: string;
  type: string;
  attributes: AvsData;
}

export interface AvsApiResponse {
  data: AvsApiResponseData;
}
