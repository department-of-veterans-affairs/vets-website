import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientInboxPage from './pages/PatientInboxPage';
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

    PatientErrorPage.loadInboxFolderThreads500Error();
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
