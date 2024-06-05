import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT } from './utils/constants';

describe(manifest.appName, () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    FolderLoadPage.loadInboxMessages();
  });

  it('Check the Inbox folder', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    FolderLoadPage.verifyFolderHeaderText('Inbox');
    FolderLoadPage.verifyBackToMessagesButton();
  });

  it('Check the Draft folder', () => {
    FolderLoadPage.loadDraftMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    FolderLoadPage.verifyFolderHeaderText('Drafts');
    FolderLoadPage.verifyBackToMessagesButton();
  });

  it('Check the Sent folder', () => {
    FolderLoadPage.loadSentMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    FolderLoadPage.verifyFolderHeaderText('Sent');
    FolderLoadPage.verifyBackToMessagesButton();
  });

  it('Check the Trash folder', () => {
    FolderLoadPage.loadDeletedMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    FolderLoadPage.verifyFolderHeaderText('Trash');
    FolderLoadPage.verifyBackToMessagesButton();
  });
});
