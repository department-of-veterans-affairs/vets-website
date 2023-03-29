import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging - Compose with Clickable URL', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  it('search for clickable URL', () => {
    site.login();
    landingPage.loadInboxMessages();

    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="compose-message-link"]').click();
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    cy.get('[name="COVID"]').click();
    composePage.getMessageSubjectField().type('Message with Clickable URL');
    composePage.getMessageBodyField().type('https://www.va.gov/');
    composePage.verifyClickableURLinMessageBody('https://www.va.gov/');
    composePage.sendMessage();
    composePage.verifySendMessageConfirmationMessage();
  });
});
