import manifest from '../../manifest.json';
import PatientMessagesInboxPage from './pages/PatientMessagesInboxPage';
import mockMessages from '../fixtures/messages-response.json';

describe(manifest.appName, () => {
  it('Axe Check Trash Folder', () => {
    const landingPage = new PatientMessagesInboxPage();
    landingPage.login();
    landingPage.loadPage();
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
    cy.axeCheck();
  });
});
