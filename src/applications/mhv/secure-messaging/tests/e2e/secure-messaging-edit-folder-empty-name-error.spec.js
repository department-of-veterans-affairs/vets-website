import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';

describe('verify error edit folder with empty name folders', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const newFolder = `folder${Date.now()}`;

  before(() => {
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
  });

  it('verify folder created', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    PatientMessageCustomFolderPage.createCustomFolder(newFolder);

    folderPage.verifyCreateFolderSuccessMessage();
  });
});
