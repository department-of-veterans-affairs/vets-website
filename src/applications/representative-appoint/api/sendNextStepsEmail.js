import * as Sentry from '@sentry/browser';

import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import { NEXT_STEPS_EMAIL_API } from '../constants/api';
import manifest from '../manifest.json';
import { getBaseUrl } from '../config/form';

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

  try {
    const response = await fetch(
      `${getBaseUrl()}${NEXT_STEPS_EMAIL_API}`,
      apiSettings,
    );

    if (!response.ok) {
      const errorBody = await response.json();

      const errorMessage = `Error on API request to ${getBaseUrl()}${NEXT_STEPS_EMAIL_API}: ${
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
