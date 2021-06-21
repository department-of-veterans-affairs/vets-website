import Timeouts from 'platform/testing/e2e/timeouts';
import manifest from '../manifest.json';
import environments from 'site/constants/environments';

describe('Caregivers test', () => {
  it('Loads the page body', () => {
    const disabled =
      manifest.e2eTestsDisabled &&
      process.env.BUILDTYPE !== environments.LOCALHOST;
    // TODO: Remove this when CI builds temporary landing pages to run e2e tests
    // Carried forward the above comment from the Nightwatch test.  This is disabled in manifest.json so it will be skipped in testing for the time being.
    if (!disabled) {
      cy.visit('/caregivers');
      cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
      cy.injectAxeThenAxeCheck();
    }
  });
});
