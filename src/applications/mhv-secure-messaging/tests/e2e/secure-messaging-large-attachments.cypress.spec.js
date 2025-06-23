import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('SM MESSAGING LARGE ATTACHMENT', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      { name: `mhv_secure_messaging_large_attachments`, value: true },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.interceptSentFolder();
  });

  it('verify information block', () => {
    cy.get(`.attachments-section`)
      .find(`.additional-info-title`)
      .click();

    PatientComposePage.verifyAttachmentInfo(Data.LARGE_ATTACH_INFO);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
