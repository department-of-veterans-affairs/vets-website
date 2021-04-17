import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const loadPdfData = async (useMockData, questionnaireResponseId) => {
  let promise;
  if (useMockData) {
    promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          blob: () => Promise.resolve('123 testing'),
        });
      }, 1000);
    });
  } else {
    const url = '/health_quest/v0/questionnaire_manager/';
    promise = apiRequest(
      `${environment.API_URL}${url}${questionnaireResponseId}`,
    );
  }
  return promise;
};

export { loadPdfData };
