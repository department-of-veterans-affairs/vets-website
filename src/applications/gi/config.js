import environment from 'platform/utilities/environment';
import manifest from './manifest.json';

export const api = {
  url: `${environment.API_URL}/v1/gi`,
  settings: {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',

      // Pull app name directly from manifest since this config is defined
      // before startApp, and using window.appName here would result in
      // undefined for all requests that use this config.
      'Source-App-Name': manifest.entryName,
    },
  },
};
export const apiV0 = {
  url: `${environment.API_URL}/v0/gi`,
  settings: {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',

      // Pull app name directly from manifest since this config is defined
      // before startApp, and using window.appName here would result in
      // undefined for all requests that use this config.
      'Source-App-Name': manifest.entryName,
    },
  },
};
