import claimsList from './fixtures/mocks/claims-list.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, false, false, 3).then(data => {
    mockDetails = data;
  });
});

describe('Claim Estimation Breadcrumb Test', () => {
  it('Verifies the breadcrumb contents', () => {
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
        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    // Disabled until COVID-19 message removed

    // const selector = '.claim-estimate-link';

    // cy.pause(500);
    // cy.get(selector, { timeout: Timeouts.normal })
    //   .click()
    //   .then(() => {
    //     cy.get('.claims-paragraph-header', { timeout: Timeouts.normal });
    //     cy.injectAxeThenAxeCheck();
    //   });
    // cy.get('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]')
    //   .should('exist')
    //   .then(breadcrumb => {
    //     cy.wrap(breadcrumb).should('contain', 'Estimated decision date');
    //     cy.wrap(breadcrumb).should('have.css', 'pointer-events', 'none');
    //   });
  });
});
