// // import 'cypress';
// import mockUser from './fixtures/mock-user.json';

import responseMapBoxAustin from './api_3rd_party/mapbox-com-austin.json';

// Helper data structure to create cy.intercept for multiple endpoints
const interceptVaApis = [
  {
    path: 'https://api.mapbox.com/geocoding/v5/mapbox.places/austin.json*',
    response: responseMapBoxAustin,
  },
];

export const intercept3rdPartyResponses = () => {
  interceptVaApis.forEach(({ path, response, method }) => {
    cy.intercept(method ?? 'GET', path, response);
  });
};

export default intercept3rdPartyResponses;
