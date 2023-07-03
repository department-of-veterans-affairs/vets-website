import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';

describe(manifest.appName, () => {
  const folderPage = new FolderLoadPage();
  const site = new SecureMessagingSite();
  describe('Load Inbox messages', () => {
    before(() => {
      site.login();
      folderPage.loadInboxMessages();
    });
    it('Check the header', () => {
      folderPage.getFolderHeader('Inbox');
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
      folderPage.loadDraftMessages();
    });
    it('Check the header', () => {
      folderPage.getFolderHeader('Drafts');
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
      folderPage.loadSentMessages();
    });
    it('Check the header', () => {
      folderPage.getFolderHeader('Sent messages');
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
      folderPage.loadDeletedMessages();
    });
    it('Check the header', () => {
      folderPage.getFolderHeader('Trash');
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
