import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('Secure Messaging Compose', () => {
  const updatedFeatureTooggles = GeneralFunctionsPage.updateFeatureToggles(
    `mhv_secure_messaging_recipient_opt_groups`,
    true,
  );
  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureTooggles);
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });

  it('verify interface', () => {
    PatientComposePage.verifyHeader(Data.START_NEW_MSG);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
