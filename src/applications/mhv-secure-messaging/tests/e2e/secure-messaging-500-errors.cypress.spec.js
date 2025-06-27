import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';
import { AXE_CONTEXT } from './utils/constants';
// import FolderLoadPage from './pages/FolderLoadPage';

describe('SM 500 ERRORS', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
  });
  it('verify 500 error on folders call', () => {
    PatientErrorPage.loadFolders500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on allRecipients call', () => {
    PatientErrorPage.loadRecipients500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on inbox threads call', () => {
    PatientErrorPage.loadInboxFolderThreads500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error in sent threads call', () => {
    PatientErrorPage.loadSentFolder500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  // it('verify 500 error on custom folder threads call', () => {
  //   PatientInboxPage.loadInboxMessages();
  //   FolderLoadPage.loadFolders();
  //
  //   PatientErrorPage.loadCustomFolderThreads500Error();
  //   PatientErrorPage.verifyError500Content();
  //
  //   cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  // });
});
