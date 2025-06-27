import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';
import { AXE_CONTEXT } from './utils/constants';

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

  it('verify 500 error of inbox threads call', () => {
    PatientErrorPage.loadInboxFolderThreads500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error of sent threads call', () => {
    PatientErrorPage.loadSentFolderThreads500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error of drafts threads call', () => {
    PatientErrorPage.loadDraftsFolderThreads500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error of trash threads call', () => {
    PatientErrorPage.loadTrashFolderThreads500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify 500 error on custom folder threads call', () => {
    PatientErrorPage.loadCustomFolderThreads500Error();
    PatientErrorPage.verifyError500Content();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
