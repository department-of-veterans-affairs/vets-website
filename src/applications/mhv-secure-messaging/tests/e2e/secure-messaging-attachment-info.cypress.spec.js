import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM MESSAGING COMPOSE', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      { name: `mhv_secure_messaging_large_attachments`, value: true },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.interceptSentFolder();
  });

  it('verify interface', () => {
    cy.get(`.attachments-section`)
      .find(`.additional-info-title`)
      .click();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
