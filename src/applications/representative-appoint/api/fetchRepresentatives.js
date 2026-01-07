import environment, {
  isLocalhostBaseUrl,
} from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import { getRepresentativesApi } from '../constants/api';
import manifest from '../manifest.json';

export const fetchRepresentatives = async ({ query }) => {
  const apiSettings = {
    mode: 'cors',
    method: 'GET',
    headers: {
      'X-Key-Inflection': 'camel',
      'Sec-Fetch-Mode': 'cors',
      'Content-Type': 'application/json',
      'Source-App-Name': manifest.entryName,
    },
  };

  const startTime = new Date().getTime();

  const apiUrl = isLocalhostBaseUrl(environment.BASE_URL)
    ? `https://staging-api.va.gov`
    : `${environment.API_URL}`;
  const path = getRepresentativesApi();

  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}${path}?query=${query}`, apiSettings)
      .then(res => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      })
      .then(res => {
        const endTime = new Date().getTime();
        res.meta = { ...res.meta, resultTime: endTime - startTime };
        return res;
      })
      .then(resolve, reject);
  });
};
