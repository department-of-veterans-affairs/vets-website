import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from '../fixtures/messages-response.json';

describe('Secure Messaging Trash Folder AXE Check', () => {
  it('Axe Check Trash Folder', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.intercept('GET', '/my_health/v1/messaging/folders/-3', mockMessages).as(
      'trashFolder',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/messages',
      mockMessages,
    ).as('trashFolderMessages');
    cy.get('[data-testid="trash-sidebar"]').click();
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
