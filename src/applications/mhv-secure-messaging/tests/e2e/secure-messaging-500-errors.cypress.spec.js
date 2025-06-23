import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import PatientInboxPage from './pages/PatientInboxPage';
import mockSentMessages from './fixtures/sentResponse/sent-messages-response.json';
import mockMessages from './fixtures/threads-response.json';
import FolderLoadPage from './pages/FolderLoadPage';

describe('SM 500 ERRORS', () => {
  it('verify 500 error on folders call', () => {
    SecureMessagingSite.login();
    PatientErrorPage.loadFolders500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on allRecipients call', () => {
    SecureMessagingSite.login();
    PatientErrorPage.loadRecipients500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on inbox thread call', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    cy.intercept('GET', Paths.INTERCEPT.PARTICULAR_THREAD, {
      statusCode: 500,
    }).as(`threadError`);

    cy.visit(
      `${Paths.PARTICULAR_THREAD}${mockMessages.data[0].attributes.messageId}/`,
    );

    // PatientErrorPage.loadInboxFolderThreads500Error();
    // PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on sent thread call', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockSentMessages);
    FolderLoadPage.loadFolders();

    PatientErrorPage.loadSentFolderThreads500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on custom folder thread call', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();

    PatientErrorPage.loadCustomFolderThreads500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
