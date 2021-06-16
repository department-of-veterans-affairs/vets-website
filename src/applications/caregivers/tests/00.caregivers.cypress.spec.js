import Timeouts from 'platform/testing/e2e/timeouts';
import manifest from '../manifest.json';
import environments from 'site/constants/environments';

describe('Caregivers test', () => {
  it('Loads the page body', () => {
    if (
      !(
        manifest.e2eTestsDisabled &&
        process.env.BUILDTYPE !== environments.LOCALHOST
      )
    )
      cy.visit('/caregivers');
    cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
