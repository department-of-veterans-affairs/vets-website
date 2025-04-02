import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import mockThread from './fixtures/thread-response.json';

describe('verify signature', () => {
  const currentDate = new Date().toISOString();
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('signature added on composing', () => {
    PatientInboxPage.navigateToComposePage();
    PatientInboxPage.verifySignature();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('signature added on replying', () => {
    PatientInboxPage.loadSingleThread(mockThread, currentDate);
    PatientInboxPage.replyToMessage();
    PatientInboxPage.verifySignature();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
