import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientErrorPage from './pages/PatientErrorPage';

describe('Thread list load error', () => {
  const site = new SecureMessagingSite();

  it('verify error on particular folder', () => {
    site.login();
    PatientErrorPage.loadParticularFolderError();
    PatientErrorPage.verifyAlertMessage();
  });

  it('verify error in My folders', () => {
    site.login();
    PatientErrorPage.loadMyFoldersError();
    PatientErrorPage.verifyAlertMessage();
  });
});
