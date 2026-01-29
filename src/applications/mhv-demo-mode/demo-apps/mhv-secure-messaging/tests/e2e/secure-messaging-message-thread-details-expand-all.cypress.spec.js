import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import threadResponse from './fixtures/thread-response-new-api.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM EXPAND ALL ACCORDIONS', () => {
  const date = new Date();
  threadResponse.data[0].attributes.sentDate = date.toISOString();

  it('verify details of expanded messages', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientMessageDetailsPage.loadSingleThread();

    PatientMessageDetailsPage.verifyExpandedMessageTo(threadResponse);

    PatientMessageDetailsPage.verifyExpandedThreadBody(threadResponse);

    PatientMessageDetailsPage.collapseAllThreadMessages();

    PatientMessageDetailsPage.verifyAccordionStatus(false);

    PatientMessageDetailsPage.expandAllThreadMessages();

    PatientMessageDetailsPage.verifyAccordionStatus(true);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
