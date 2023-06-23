import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';

describe(manifest.appName, () => {
  describe('Load Inbox messages', () => {
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
      inboxPage.loadInboxMessages();
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
    });
  });
});
