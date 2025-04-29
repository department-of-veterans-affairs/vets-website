import { apiRequest } from '~/platform/utilities/api';

export async function getDataForPath(path) {
  return apiRequest(`/banners/?path=${path}`, { apiVersion: 'v0' });
}
