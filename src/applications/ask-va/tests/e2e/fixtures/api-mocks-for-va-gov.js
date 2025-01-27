// // import 'cypress';
// import mockUser from './fixtures/user.json';

import responseFeatureToggles from './api_va_gov/feature-toggles.json';

// Helper data structure to create cy.intercept for multiple endpoints
const interceptVaApis = [
  {
    path: '/v0/feature_toggles*',
    response: responseFeatureToggles,
  },
];

export const interceptVaResponses = () => {
  interceptVaApis.forEach(({ path, response }) => {
    cy.intercept('GET', path, response);
  });
};

export default interceptVaResponses;
