import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('SM MAIN PAGE REDIRECTING', () => {
  it('verify redirecting to inbox with feature flag', () => {
    const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([
      { name: 'mhv_secure_messaging_remove_landing_page', value: true },
    ]);

    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(updatedFeatureToggle);

    cy.url().should(`include`, Paths.INBOX);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
