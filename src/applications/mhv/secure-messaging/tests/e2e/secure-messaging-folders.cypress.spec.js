import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';

describe(manifest.appName, () => {
  const site = new SecureMessagingSite();
  describe('Load Inbox messages', () => {
    before(() => {
      site.login();
      FolderLoadPage.loadInboxMessages();
    });
    it('Check the header', () => {
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
  });
  describe('Load Draft messages', () => {
    before(() => {
      site.login();
      FolderLoadPage.loadInboxMessages();
      FolderLoadPage.loadDraftMessages();
    });
    it('Check the header', () => {
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
  });
  describe('Load Sent messages', () => {
    before(() => {
      site.login();
      FolderLoadPage.loadInboxMessages();
      FolderLoadPage.loadSentMessages();
    });
    it('Check the header', () => {
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
  });
  describe('Load Trash messages', () => {
    before(() => {
      site.login();
      FolderLoadPage.loadInboxMessages();
      FolderLoadPage.loadDeletedMessages();
    });
    it('Check the header', () => {
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
});
