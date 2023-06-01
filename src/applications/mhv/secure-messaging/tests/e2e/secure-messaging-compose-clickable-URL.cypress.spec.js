import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('Secure Messaging - Compose with Clickable URL', () => {
  it('search for clickable URL', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="compose-message-link"]').click();
    PatientInterstitialPage.getContinueButton().click();
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.getCategory('COVID').click();
    PatientComposePage.getMessageSubjectField().type(
      'Message with Clickable URL',
    );
    PatientComposePage.getMessageBodyField().type('https://www.va.gov/');
    PatientComposePage.verifyClickableURLinMessageBody('https://www.va.gov/');
    PatientComposePage.sendMessage();
    cy.injectAxe();
    cy.axeCheck();
    PatientComposePage.verifySendMessageConfirmationMessage();
  });
});
