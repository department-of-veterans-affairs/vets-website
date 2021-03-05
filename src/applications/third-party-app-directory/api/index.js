import { apiRequest } from 'platform/utilities/api';

export const fetchResults = () => apiRequest('/apps');

export const fetchScopes = category => apiRequest(`/apps/scopes/${category}`);
