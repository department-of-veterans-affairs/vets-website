import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('SM MAIN PAGE REDIRECTING', () => {
  it('verify redirecting to inbox with feature flag', () => {
    const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([]);

    SecureMessagingSite.login(updatedFeatureToggle);

    cy.visit(Paths.UI_MAIN);

    cy.url().should(`include`, Paths.INBOX);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
