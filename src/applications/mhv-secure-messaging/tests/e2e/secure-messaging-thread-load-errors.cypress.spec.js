import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';

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
});
