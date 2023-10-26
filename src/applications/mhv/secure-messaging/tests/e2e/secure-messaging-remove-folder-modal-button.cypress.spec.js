import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockFolders from './fixtures/generalResponses/folders.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Remove Folder message', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  before(() => {
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList(mockFolders);
  });

  it('Verify Folder Removed ', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.get('[data-testid="TestFolder3"]').click({
      waitForAnimations: true,
      force: true,
    });

    cy.get('[data-testid="remove-folder-button"]').click({
      waitForAnimations: true,
      force: true,
    });
  });
});
