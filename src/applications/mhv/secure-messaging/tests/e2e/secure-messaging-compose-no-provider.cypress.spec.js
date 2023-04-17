import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockDraftMessage from '../fixtures/message-draft-response.json';
import PatientComposePage from './pages/PatientComposePage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('Secure Messaging Compose with No Provider', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPageForNoProvider();
    cy.get('[data-testid="compose-message-link"]').click();
    patientInterstitialPage.getContinueButton().click();

    composePage.selectRecipient('');
    cy.get('[name="COVID"]').click();
    composePage.getMessageSubjectField().type('Test Subject');
    composePage.getMessageBodyField().type('Test message body');

    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get('[data-testid="Send-Button"]')
      .get('[text="Send"]')
      .click();
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="error-message"]')
      .should('contain', ' Please select a recipient.');
    cy.injectAxe();
    cy.axeCheck();
  });
});
