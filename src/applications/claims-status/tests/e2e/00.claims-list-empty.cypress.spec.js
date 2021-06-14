const Timeouts = require('platform/testing/e2e/timeouts.js');

import claimsListEmpty from './fixtures/mocks/claims-list-empty.json';

describe('Breadcrumb Test Empty List', () => {
  it('Verifies functionality with an empty list', () => {
    cy.intercept('GET', '/v0/evss_claims_async', claimsListEmpty);
    cy.login();
    cy.visit('/track-claims');
    cy.get('.claims-container-title', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    // });
    cy.get('.claims-alert').should(
      'contain',
      'You do not have any submitted claims',
    );
    cy.injectAxeThenAxeCheck();
  });
});
