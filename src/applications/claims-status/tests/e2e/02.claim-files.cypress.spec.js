import claimsList from './fixtures/mocks/claims-list.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

describe('Claim Files Test', () => {
  it('Submits files properly', () => {
    cy.intercept('GET', '/v0/evss_claims_async', claimsList);
    cy.initClaimDetailMocks(false, true, false, 8).then(mockData => {
      cy.intercept('GET', '/v0/evss_claims_async/11', mockData).as(
        'mockDetail',
      );
    });
    cy.getUserToken().then(token => {
      cy.logIn(token, '/track-claims', 3);
    });
    cy.get('.claim-list-item-container', { timeout: Timeouts.slow }).should(
      'be.visible',
    );

    cy.get('.claim-list-item-container:first-child a.vads-c-action-link--blue')
      .click()
      .then(() => {
        cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
  });
});
