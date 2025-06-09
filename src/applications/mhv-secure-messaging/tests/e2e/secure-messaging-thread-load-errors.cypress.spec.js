import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import PatientInboxPage from './pages/PatientInboxPage';
import mockSentMessages from './fixtures/sentResponse/sent-messages-response.json';
import FolderLoadPage from './pages/FolderLoadPage';

describe('THREAD LIST LOAD ERRORS', () => {
  it('verify error on particular folder', () => {
    SecureMessagingSite.login();
    PatientErrorPage.loadParticularFolderError();
    PatientErrorPage.verifyAlertMessageText();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify error in My folders', () => {
    SecureMessagingSite.login();
    PatientErrorPage.loadMyFoldersError();
    PatientErrorPage.verifyAlertMessageText();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 404 page', () => {
    SecureMessagingSite.login();

    cy.visit(`${Paths.UI_MAIN}/inbox404`);
    PatientErrorPage.verifyPageNotFoundContent();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on inbox thread call', () => {
    SecureMessagingSite.login();

    PatientErrorPage.loadInboxFolder500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on sent thread call', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockSentMessages);
    FolderLoadPage.loadFolders();

    PatientErrorPage.loadSentFolder500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on custom folder thread call', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();

    PatientErrorPage.loadCustomFolder500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
