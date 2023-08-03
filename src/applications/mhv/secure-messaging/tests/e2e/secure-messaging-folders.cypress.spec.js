import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    FolderLoadPage.loadInboxMessages();
  });
  it('Check the Inbox folder', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    FolderLoadPage.getFolderHeader('Inbox');
    FolderLoadPage.verifyBackToMessagesButton();
  });

  it('Check the Draft folder', () => {
    FolderLoadPage.loadDraftMessages();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    FolderLoadPage.getFolderHeader('Drafts');
    FolderLoadPage.verifyBackToMessagesButton();
  });

  it('Check the Sent folder', () => {
    FolderLoadPage.loadSentMessages();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    FolderLoadPage.getFolderHeader('Sent messages');
    FolderLoadPage.verifyBackToMessagesButton();
  });

  it.skip('Check the header', () => {
    FolderLoadPage.loadDeletedMessages();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    FolderLoadPage.getFolderHeader('Trash');
    FolderLoadPage.verifyBackToMessagesButton();
  });
});
