import environment from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import { REPRESENTATIVES_API } from '../constants/api';
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

  const apiUrl =
    environment.BASE_URL === 'http://localhost:3001'
      ? `https://staging-api.va.gov`
      : `${environment.API_URL}`;

  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}${REPRESENTATIVES_API}?query=${query}`, apiSettings)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }

        return res.json();
      })
      .then(res => {
        const endTime = new Date().getTime();
        const resultTime = endTime - startTime;
        res.meta = {
          ...res.meta,
          resultTime,
        };
        return res;
      })
      .then(
        data => resolve(data),
        error => reject(error),
      );
  });
};
