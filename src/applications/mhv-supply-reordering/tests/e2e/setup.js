import featureToggles from '../fixtures/mocks/feature_toggles.json';
import ipfMdotGetMock from '../fixtures/mocks/ipf_mdot_get.json';
import ipfMdotPutMock from '../fixtures/mocks/ipf_mdot_put.json';
import mdotSuppliesPostMock from '../fixtures/mocks/mdot_supplies_post.json';
import userMock from '../fixtures/mocks/user.json';

Cypress.Commands.add('clickContinue', () => {
  cy.findByRole('button', { name: 'Continue' }).click();
});

const initializeApi = () => {
  cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
  cy.intercept('GET', '/v0/in_progress_forms/MDOT', ipfMdotGetMock);
  cy.intercept('PUT', '/v0/in_progress_forms/MDOT', ipfMdotPutMock);
  cy.intercept('POST', '/v0/mdot/supplies', mdotSuppliesPostMock);
  cy.intercept('GET', '/v0/user', userMock);
};

export { initializeApi, userMock };
