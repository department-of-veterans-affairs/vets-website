import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.get('[data-testid="compose-message-link"]').click();
    PatientInterstitialPage.getContinueButton().click();
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.getCategory('COVID').click();
    PatientComposePage.attachMessageFromFile('test_image.jpg');
    PatientComposePage.getMessageSubjectField().type('Test Subject');
    PatientComposePage.getMessageBodyField().type('Test message body');
    PatientComposePage.sendMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
