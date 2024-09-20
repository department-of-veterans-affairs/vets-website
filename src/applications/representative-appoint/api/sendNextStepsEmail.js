import environment from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import { NEXT_STEPS_EMAIL_API } from '../constants/api';
import manifest from '../manifest.json';

export default async function sendNextStepsEmail(body) {
  const apiSettings = {
    mode: 'cors',
    method: 'POST',
    headers: {
      'X-Key-Inflection': 'camel',
      'Sec-Fetch-Mode': 'cors',
      'Content-Type': 'application/json',
      'Source-App-Name': manifest.entryName,
    },
    body,
  };

  const apiUrl =
    environment.BASE_URL === 'http://localhost:3001'
      ? `https://staging-api.va.gov`
      : `${environment.API_URL}`;

  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}${NEXT_STEPS_EMAIL_API}`, apiSettings)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(resolve)
      .catch(reject);
  });
}
