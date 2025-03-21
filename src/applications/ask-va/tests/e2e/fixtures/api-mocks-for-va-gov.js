// // import 'cypress';
// import mockUser from './fixtures/mock-user.json';

import responseFeatureToggles from './api_va_gov/feature-toggles.json';
import responseFormProgress from './api_va_gov/form-progress-0873.json';

// Helper data structure to create cy.intercept for multiple endpoints
const interceptVaApis = [
  {
    path: '/v0/feature_toggles*',
    response: responseFeatureToggles,
  },
  {
    path: '/v0/in_progress_forms/0873*',
    response: responseFormProgress,
    method: 'PUT',
  },
];

export const interceptVaResponses = () => {
  interceptVaApis.forEach(({ path, response, method }) => {
    cy.intercept(method ?? 'GET', path, response);
  });
};

export default interceptVaResponses;
