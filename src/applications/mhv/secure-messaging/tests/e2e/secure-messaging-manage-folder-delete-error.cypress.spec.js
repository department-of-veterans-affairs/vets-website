import SecureMessagingSite from './site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import customFolderMessage from './fixtures/messages-response.json';
import customFolder from './fixtures/folder-custom-metadata.json';

describe('Secure Messaging Custom Folder Delete Error Message Validation', () => {
  it('Axe Check Custom Folder List', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175',
      customFolder,
    ).as('test2Folder');
    landingPage.loadPage();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175/messages?per_page=-1&useCache=false',
      customFolderMessage,
    ).as('customFolder');

    cy.get('[data-testid="my-folders-sidebar"]').click();

    // cy.wait('@customFolder');
    // cy.wait('@test2Folder');
    cy.contains('TEST2').click();

    // cy.injectAxe();
    // cy.axeCheck();

    cy.get('.right-button').click({ force: true });

    cy.get('[class="modal hydrated"]')
      .shadow()
      .find('[class="va-modal-inner va-modal-alert"]');

    cy.get('[visible=""] > p');

    // For edit button
    // cy.get('.left-button')
    //     .click({ force: true });
    // cy.get('[name="new-folder-name"]')
    //     .shadow()
    //     .find('[id="inputField"]')
    //     .type('Testing');
  });
});
