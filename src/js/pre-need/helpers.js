import Raven from 'raven-js';
import environment from '../common/helpers/environment.js';

export function getCemeteries() {
  return fetch(`${environment.API_URL}/v0/preneed/cemeteries`, {
    headers: {
      'X-Key-Inflection': 'camel'
    },
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(res);
    }

    return res.json();
  }).then(res => {
    const options = res.data.map(item => ({
      label: item.attributes.name,
      id: item.id
    }));

    return options;
  }).catch(res => {
    if (res instanceof Error) {
      Raven.captureException(res);
      Raven.captureMessage('vets_preneed_cemeteries_error');
    }

    // May change this to a reject later, depending on how we want
    // to surface errors in autosuggest field
    return Promise.resolve([]);
  });
}
