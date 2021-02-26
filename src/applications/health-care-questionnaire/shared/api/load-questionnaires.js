import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const USE_MOCK_DATA =
  window.Cypress || environment.isLocalhost || environment.isStaging;

const loadQuestionnaires = async () => {
  let promise;
  if (USE_MOCK_DATA) {
    promise = new Promise(resolve => {
      setTimeout(() => {
        import(/* webpackChunkName: "my-questionnaires-sample-json" */ './my-questionnaires.sample.json').then(
          module => {
            resolve(module.default);
          },
        );
      }, 1000);
    });
  } else {
    const url = '/health_quest/v0/my/questionnaires';
    promise = apiRequest(`${environment.API_URL}${url}`);
  }
  return promise;
};

export { loadQuestionnaires };
