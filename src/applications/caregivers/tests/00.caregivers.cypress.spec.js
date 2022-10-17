import environments from 'site/constants/environments';
import manifest from '../manifest.json';

describe('Caregivers test', () => {
  it('Loads the page body', () => {
    const disabled =
      manifest.e2eTestsDisabled &&
      process.env.BUILDTYPE !== environments.LOCALHOST;
    // TODO: Remove this when CI builds temporary landing pages to run e2e tests
    // Carried forward the above comment from the Nightwatch test.  This is disabled in manifest.json so it will be skipped in testing for the time being. I believe this is being done, as at the time this test would be running, there is no caregivers page existing to axeCheck.
    if (!disabled) {
      cy.visit('/caregivers');
      cy.get('body').should('be.visible');
      cy.injectAxeThenAxeCheck();
    }
  });
});
