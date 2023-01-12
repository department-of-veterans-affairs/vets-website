import SecureMessagingSite from './site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
// import customFolderMessage from './fixtures/message-response.json';
import customFolder from './fixtures/folder-custom-metadata.json';

describe('Secure Messaging Custom Folder Delete Error Message Validation', () => {
  it('Axe Check Custom Folder List', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175/messages?per_page=-1&useCache=false',
      customFolder,
    ).as('customFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175',
      customFolder,
    ).as('test2Folder');

    cy.get('[data-testid="my-folders-sidebar"]').click();

    cy.contains('TEST2').click({ force: true });

    cy.wait('@test2Folder', { responseTimeout: 8000 });

    cy.injectAxe();
    cy.axeCheck();

    // cy.wait('@customFolder');

    cy.get('.right-button').click();

    // For edit button
    // cy.get('.left-button')
    //     .click({ force: true });
    // cy.get('[name="new-folder-name"]')
    //     .shadow()
    //     .find('[id="inputField"]')
    //     .type('Testing');
  });
});
