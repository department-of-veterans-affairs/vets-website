import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockDraftMessage from '../fixtures/message-draft-response.json';
import PatientComposePage from './pages/PatientComposePage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('Secure Messaging Compose with No Provider', () => {
  it('can send message', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadPageForNoProvider();
    cy.get('[data-testid="compose-message-link"]').click({ force: true });
    PatientInterstitialPage.getContinueButton().click({ force: true });

    PatientComposePage.selectRecipient('');
    PatientComposePage.getCategory('COVID').click();
    PatientComposePage.getMessageSubjectField().type('Test Subject');
    PatientComposePage.getMessageBodyField().type('Test message body');

    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get('[data-testid="Send-Button"]')
      .get('[text="Send"]')
      .click();
    PatientComposePage.verifySelcteRespitantErrorMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
