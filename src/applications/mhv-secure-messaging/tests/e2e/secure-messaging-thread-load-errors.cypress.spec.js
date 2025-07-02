import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('Thread list load error', () => {
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
});
