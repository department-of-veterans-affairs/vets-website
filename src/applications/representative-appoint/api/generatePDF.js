import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as Sentry from '@sentry/browser';
import { pdfTransform } from '../utilities/pdfTransform';
import { formIs2122A } from '../utilities/helpers';
import manifest from '../manifest.json';

export const generatePDF = async formData => {
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

  const formType = formIs2122A(formData) ? '2122a' : '2122';

  const requestUrl = `${environment.API_URL}/representation_management/v0/pdf_generator${formType}`;

  try {
    const response = await apiRequest(requestUrl, apiSettings);

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    localStorage.setItem('pdfUrl', downloadUrl);
  } catch (error) {
    Sentry.captureException(
      new Error(`${formType} PDF Generation Error: ${error}`),
    );

    throw error;
  }
};
