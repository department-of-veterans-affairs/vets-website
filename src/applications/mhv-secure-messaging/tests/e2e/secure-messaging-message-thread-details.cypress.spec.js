import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';
import threadResponse from './fixtures/thread-response-new-api.json';

describe('SM THREAD SINGLE MESSAGE DETAILED VIEW', () => {
  const date = new Date();
  threadResponse.data[0].attributes.sentDate = date.toISOString();

  before(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread();
  });

  it('verify expanded message details', () => {
    PatientMessageDetailsPage.verifyExpandedMessageFrom(threadResponse);
    PatientMessageDetailsPage.verifyExpandedMessageId(threadResponse);
    PatientMessageDetailsPage.verifyExpandedMessageDate(threadResponse);

    PatientMessageDetailsPage.verifyMessageAttachment(threadResponse);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
