import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  it('can send message', () => {
    const landingPage = new PatientMessagesLandingPage();
    const composePage = new PatientComposePage();
    landingPage.login();
    landingPage.loadPage(false);
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="compose-select"]')
      .shadow()
      .find('[id="select"]')
      .select('BLUE ANCILLARY_TEAM');
    cy.get('[name="COVID"]').click();
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_image.jpg',
      { force: true },
    );
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]')
      .type('Test Subject');
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Test message body');
    composePage.sendMessage();
  });
});
