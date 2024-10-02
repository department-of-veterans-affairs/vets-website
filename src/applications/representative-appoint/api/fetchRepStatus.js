import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { REPRESENTATIVE_STATUS_API } from '../constants/api';

export const fetchRepStatus = async () => {
  const requestUrl = `${
    environment.BASE_URL === 'http://localhost:3001'
      ? `https://staging-api.va.gov`
      : `${environment.API_URL}`
  }${REPRESENTATIVE_STATUS_API}`;
  const apiSettings = {
    'Content-Type': 'application/json',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
    },
  };
  const startTime = new Date().getTime();

  return new Promise((resolve, reject) => {
    fetch(requestUrl, apiSettings)
      .then(response => {
        if (!response.ok && response.status !== 422) {
          throw Error(response.statusText);
        }

        return response.json();
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
      .then(data => resolve(data), error => reject(error));
  });
};

export default fetchRepStatus;
