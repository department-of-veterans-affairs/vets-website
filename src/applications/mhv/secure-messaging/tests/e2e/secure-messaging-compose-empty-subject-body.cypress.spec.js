import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';

describe('Secure Messaging Compose with No Subject or Body', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[data-testid="compose-message-link"]').click();
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select('CAMRY_PCMM RELATIONSHIP_05092022_SLC4'); // trieageTeams with preferredTeam = true will appear in a recipients dropdown only
    cy.get('[name="COVID"]').click();
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_image.jpg',
      { force: true },
    );
  });
  it('empty message subject error', () => {
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Test message body');
    composePage.clickOnSendMessageButton();
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[id=input-error-message]')
      .should('be.visible');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('empty message body error', () => {
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
