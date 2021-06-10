import moment from 'moment';
import claimsList from './fixtures/mocks/claims-list.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

describe('Claims status est current test', () => {
  it('Shows the correct status for the claim', () => {
    cy.intercept('GET', '/v0/evss_claims_async', claimsList);
    cy.initClaimDetailMocks(
      false,
      true,
      false,
      6,
      moment()
        .add(5, 'years')
        .format('YYYY-MM-DD'),
    ).then(mockData => {
      cy.intercept('GET', '/v0/evss_claims_async/11', mockData).as(
        'mockDetail',
      );
    });
    cy.getUserToken().then(token => {
      cy.logIn(token, '/track-claims', 3);
    });

    cy.get('.claim-list-item-container:first-child a.vads-c-action-link--blue')
      .click()
      .then(() => {
        cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    cy.url().should('contain', '/your-claims/11/status');

    cy.get('.usa-alert-text').should('contain', 'COVID-19 has had on');
  });
});
