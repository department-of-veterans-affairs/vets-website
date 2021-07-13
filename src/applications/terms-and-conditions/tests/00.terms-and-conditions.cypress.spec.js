import Timeouts from 'platform/testing/e2e/timeouts';
import manifest from '../manifest.json';

describe('Terms and Conditions test', () => {
  it('Page loads and passes accessibility check', () => {
    cy.visit(manifest.rootUrl);
    cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
