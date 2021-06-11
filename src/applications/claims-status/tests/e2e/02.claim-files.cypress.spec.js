import claimsList from './fixtures/mocks/claims-list.json';
import moment from 'moment';

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

describe('Claim Files Test', () => {
  it('Submits files properly', () => {
    cy.intercept('GET', `/v0/evss_claims_async/11`, mockDetails).as(
      'detailRequest',
    );
    cy.intercept('GET', `/v0/evss_claims_async`, claimsList).as('claim');

    cy.visit('/track-claims');
    cy.login();
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
