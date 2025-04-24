import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import inboxMessages from './fixtures/threads-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import singleThreadResponse from './fixtures/thread-response-new-api.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM SINGLE MESSAGE DETAILS', () => {
  it('verify single message details', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(inboxMessages, mockMessageDetails);

    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    PatientMessageDetailsPage.verifyMessageDetails(updatedSingleThreadResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
