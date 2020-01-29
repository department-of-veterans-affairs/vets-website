import environment from '../../platform/utilities/environment';
import manifest from './manifest.json';

export const api = {
  url: `${environment.API_URL}/v0/gi`,
  settings: {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
      'Source-App-Name': manifest.entryName,
    },
  },
};
