import * as Sentry from '@sentry/browser';

import environment from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import { NEXT_STEPS_EMAIL_API } from '../constants/api';
import manifest from '../manifest.json';

export default async function sendNextStepsEmail(body) {
  const apiSettings = {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
      'Sec-Fetch-Mode': 'cors',
      'Content-Type': 'application/json',
      'Source-App-Name': manifest.entryName,
      'X-CSRF-Token': localStorage.getItem('csrfToken'),
    },
    body: JSON.stringify(body),
  };

  const apiUrl =
    environment.BASE_URL === 'http://localhost:3001'
      ? `https://staging-api.va.gov`
      : `${environment.API_URL}`;

  try {
    const response = await fetch(
      `${apiUrl}${NEXT_STEPS_EMAIL_API}`,
      apiSettings,
    );

    if (!response.ok) {
      const errorBody = await response.json();

      const errorMessage = `Error on API request to ${apiUrl}${NEXT_STEPS_EMAIL_API}: ${
        response.statusText
      }. ${errorBody.error || 'Unknown error'}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    Sentry.captureException(new Error(`API request failed: ${error.message}`));

    throw error;
  }
}
