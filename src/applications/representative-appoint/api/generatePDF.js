import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import manifest from '../manifest.json';

export const generatePDF = (transformedFormData, is2122a) => {
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

  const startTime = new Date().getTime();

  const requestUrl = `${
    environment.API_URL
  }/representation_management/v0/pdf_generator${is2122a ? '2122a' : '2122'}`;

  return new Promise((resolve, reject) => {
    apiRequest(requestUrl, apiSettings)
      .then(response => {
        if (response.error) {
          throw Error(response.error);
        }
        return response;
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
