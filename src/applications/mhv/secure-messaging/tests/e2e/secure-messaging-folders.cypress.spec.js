import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';

describe(manifest.appName, () => {
  describe.skip('Load Inbox messages', () => {
    before(() => {
      const site = new SecureMessagingSite();
      const inboxPage = new FolderLoadPage();
      site.login();
      inboxPage.loadInboxMessages();
    });
    it('Check the header', () => {
      cy.get('[data-testid="folder-header"]').should('have.text', 'Inbox');
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
  describe.skip('Load Draft messages', () => {
    before(() => {
      const site = new SecureMessagingSite();
      const inboxPage = new FolderLoadPage();
      site.login();
      inboxPage.loadDraftMessages();
    });
    it('Check the header', () => {
      cy.get('[data-testid="folder-header"]').should('have.text', 'Drafts');
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
  describe.skip('Load Sent messages', () => {
    before(() => {
      const site = new SecureMessagingSite();
      const inboxPage = new FolderLoadPage();
      site.login();
      inboxPage.loadSentMessages();
    });
    it('Check the header', () => {
      cy.get('[data-testid="folder-header"]').should(
        'have.text',
        'Sent messages',
      );
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
      const site = new SecureMessagingSite();
      const inboxPage = new FolderLoadPage();
      site.login();
      inboxPage.loadDeletedMessages();
    });
    it('Check the header', () => {
      cy.get('[data-testid="folder-header"]').should('have.text', 'Trash');
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
