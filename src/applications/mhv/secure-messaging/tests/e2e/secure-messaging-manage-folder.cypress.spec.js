import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Manage Folder AXE check', () => {
  it('Axe Check Manage Folders', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.get('[text="Create new folder"]')
      .shadow()
      .find('[type="button"]')
      .click();
    cy.get('[name="folder-name"]')
      .shadow()
      .find('[name="folder-name"]')
      .type('create folder test');
    cy.intercept('POST', '/my_health/v1/messaging/folder', {
      statusCode: 400,
      body: {
        alertType: 'error',
        header: 'err.title',
        content: 'err.detail',
        response: {
          header: 'err.title',
          content: 'err.detail',
        },
      },
    }).as('folder');
    cy.get('[text="Create"]')
      .shadow()
      .find('[type="button"]')
      .click();
    cy.get('[class="vads-u-margin-y--0"]').should(
      'have.text',
      'Folder could not be created. Try again later. If this problem persists, contact the help desk.',
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
