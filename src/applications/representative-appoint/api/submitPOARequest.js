import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as Sentry from '@sentry/browser';
import { pdfTransform } from '../utilities/pdfTransform';
import manifest from '../manifest.json';

export const submitPOARequest = async formData => {
  const transformedFormData = pdfTransform(formData);

  const apiSettings = {
    mode: 'cors',
    method: 'POST',
    headers: {
      'X-Key-Inflection': 'camel',
      'Sec-Fetch-Mode': 'cors',
      'Content-Type': 'application/json',
      'Source-App-Name': manifest.entryName,
    },
    body: JSON.stringify(transformedFormData),
  };

  const requestUrl = `${
    environment.API_URL
  }/representation_management/v0/power_of_attorney_requests`;

  try {
    const response = await apiRequest(requestUrl, apiSettings);

    if (!response.ok) {
      const errorBody = await response.json();

      const errorMessage = `Error on API request to ${requestUrl}: ${
        response.statusText
      }. ${errorBody.error || 'Unknown error'}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    Sentry.captureException(new Error(`Submit POA Request Error: ${error}`));

    throw error;
  }
};
