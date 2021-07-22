import moment from 'moment';
import claimsList from './fixtures/mocks/claims-list.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(
    false,
    true,
    false,
    6,
    moment()
      .subtract(5, 'years')
      .format('YYYY-MM-DD'),
  ).then(data => {
    mockDetails = data;
  });
});

describe('Claims status est current test', () => {
  it('Shows the correct status for the claim', () => {
    cy.intercept('GET', `/v0/evss_claims_async/11`, mockDetails).as(
      'detailRequest',
    );
    cy.intercept('GET', `/v0/evss_claims_async`, claimsList).as('claim');
    cy.login();

    cy.visit('/track-claims');
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

    cy.url().should('contain', '/your-claims/11/status');

    cy.get('va-alert').should('contain', 'COVID-19 has had on');
  });
});
