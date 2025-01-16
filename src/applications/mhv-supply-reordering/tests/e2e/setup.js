import featureToggles from '../fixtures/mocks/feature_toggles.json';
import ipfMdotGetMock from '../fixtures/mocks/ipf_mdot_get.json';
import ipfMdotPutMock from '../fixtures/mocks/ipf_mdot_put.json';
import userMock from '../fixtures/mocks/user.json';

const initializeApi = () => {
  cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
  cy.intercept('GET', '/v0/in_progress_forms/MDOT', ipfMdotGetMock);
  cy.intercept('PUT', '/v0/in_progress_forms/MDOT', ipfMdotPutMock);
  cy.intercept('GET', '/v0/user', userMock);
};

export { initializeApi, userMock };
