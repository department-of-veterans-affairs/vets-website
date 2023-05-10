import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[data-testid="compose-message-link"]').click();
    patientInterstitialPage.getContinueButton().click();
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.getCategory('COVID').click();
    composePage.attachMessageFromFile('test_image.jpg');
    composePage.getMessageSubjectField().type('Test Subject');
    composePage.getMessageBodyField().type('Test message body');
    composePage.sendMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
