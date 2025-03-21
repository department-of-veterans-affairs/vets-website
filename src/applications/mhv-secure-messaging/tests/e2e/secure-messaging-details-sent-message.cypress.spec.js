import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageSentPage from './pages/PatientMessageSentPage';
import inboxMessages from './fixtures/threads-response.json';
import { AXE_CONTEXT } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import singleThreadResponse from './fixtures/sentResponse/sent-thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('SM SENT MESSAGE DETAILS', () => {
  it('verify sent message details', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(inboxMessages);
    PatientMessageSentPage.loadMessages();
    PatientMessageSentPage.loadSingleThread(updatedSingleThreadResponse);

    PatientMessageDetailsPage.verifyMessageDetails(updatedSingleThreadResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
