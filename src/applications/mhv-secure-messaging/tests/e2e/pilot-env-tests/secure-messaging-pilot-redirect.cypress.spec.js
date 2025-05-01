import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';

describe('SM PILOT MAIN PAGE REDIRECTING', () => {
  it('redirect to pilot inbox page visiting sm-pilot', () => {
    const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
    ]);

    SecureMessagingSite.login(updatedFeatureToggle);
    cy.visit(Paths.UI_PILOT);
    cy.url().should(`include`, Paths.INBOX);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
