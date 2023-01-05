import PatientMessagesInboxPage from './pages/PatientMessagesInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  it('empty subject and empty message body error', () => {
    const landingPage = new PatientMessagesInboxPage();
    const composePage = new PatientComposePage();
    landingPage.login();
    landingPage.loadPage(false);
    cy.get('[data-testid="compose-message-link"]').click();
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select('BLUE ANCILLARY_TEAM');
    cy.get('[name="COVID"]').click();
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_image.jpg',
      { force: true },
    );
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Test message body');
    composePage.clickOnSendMessageButton();
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[id=error-message]')
      .should('be.visible');

    cy.reload();
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]')
      .type('Test Subject');
    composePage.clickOnSendMessageButton();
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[id=error-message]')
      .should('be.visible');
    cy.injectAxe();
    cy.axeCheck();
  });
});
