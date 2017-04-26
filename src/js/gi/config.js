import environment from '../common/helpers/environment';

export const api = {
  url: `${environment.API_URL}/v0/gi`,
  settings: {
    headers: {
      'X-Key-Inflection': 'camel'
    }
  }
};
