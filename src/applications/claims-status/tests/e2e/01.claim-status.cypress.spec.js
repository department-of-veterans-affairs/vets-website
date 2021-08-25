import claimsList from './fixtures/mocks/claims-list.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claims status test', () => {
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
        cy.get('body').should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    // redirect to status tab
    cy.url().should('contain', '/your-claims/11/status');

    // status tab highlighted
    cy.get('a.va-tab-trigger.va-tab-trigger--current').should(
      'contain',
      'Status',
    );

    // conditions list
    cy.get('.claim-contentions > span').should(
      'contain',
      'Hearing Loss (New), skin condition (New), jungle rot (New)',
    );

    // timeline
    cy.get('.list-five.section-current').should('exist');
    cy.get('.list-one.section-complete').should('exist');
    cy.get('.list-two.section-complete').should('exist');
    cy.get('.list-three.section-complete').should('exist');
    cy.get('.list-four.section-complete').should('exist');

    // timeline expand
    cy.get('li.list-one')
      .click()
      .then(() => {
        cy.get('li.list-one .claims-evidence', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        cy.get('.claims-evidence:nth-child(3) .claims-evidence-item').should(
          'contain',
          'Your claim is closed',
        );
        cy.get('.claim-older-updates').should('exist');
      });
    // Nightwatch original test had an extra click on li.list-one here, however, this was collapsing the accordion causing the next step to fail.  Removed it to test the rest of the items.
    cy.get('li.list-one .claims-evidence', {
      timeout: Timeouts.slow,
    }).should('be.visible');
    // });
    cy.get('main button[aria-expanded="false"]').each(element => {
      cy.wrap(element).click();
      cy.axeCheck();
    });

    cy.get('.usa-alert-body h2').should('contain', 'your attention');
  });
});
