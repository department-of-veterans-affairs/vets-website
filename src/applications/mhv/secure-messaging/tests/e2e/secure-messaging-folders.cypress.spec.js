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
      FolderLoadPage.getFolderHeader('Inbox');
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
  });
  describe('Load Draft messages', () => {
    before(() => {
      site.login();
      FolderLoadPage.loadInboxMessages();
      FolderLoadPage.loadDraftMessages();
    });
    it('Check the header', () => {
      FolderLoadPage.getFolderHeader('Drafts');
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
  });
  describe('Load Sent messages', () => {
    before(() => {
      site.login();
      FolderLoadPage.loadInboxMessages();
      FolderLoadPage.loadSentMessages();
    });
    it('Check the header', () => {
      FolderLoadPage.getFolderHeader('Sent');
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
  });
  describe('Load Trash messages', () => {
    before(() => {
      site.login();
      FolderLoadPage.loadInboxMessages();
      FolderLoadPage.loadDeletedMessages();
    });
    it('Check the header', () => {
      FolderLoadPage.getFolderHeader('Trash');
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
  });
});
