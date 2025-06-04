import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';
import { Paths } from './utils/constants';

describe('Thread list load error', () => {
  it('verify error on particular folder', () => {
    SecureMessagingSite.login();
    PatientErrorPage.loadParticularFolderError();
    PatientErrorPage.verifyAlertMessageText();
  });

  it('verify error in My folders', () => {
    SecureMessagingSite.login();
    PatientErrorPage.loadMyFoldersError();
    PatientErrorPage.verifyAlertMessageText();
  });

  it('verify 404 page', () => {
    SecureMessagingSite.login();

    cy.visit(`${Paths.UI_MAIN}404`);
    PatientErrorPage.verifyPageNotFoundContent();

    cy.visit(`${Paths.UI_MAIN}/inbox404`);
    PatientErrorPage.verifyPageNotFoundContent();

    cy.visit(`${Paths.UI_MAIN}/new-message/404`);
    PatientErrorPage.verifyPageNotFoundContent();

    cy.visit(`${Paths.UI_MAIN}/foldersxyz`);
    PatientErrorPage.verifyPageNotFoundContent();
  });
});
