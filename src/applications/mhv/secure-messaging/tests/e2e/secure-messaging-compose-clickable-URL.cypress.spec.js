import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('Secure Messaging - Compose with Clickable URL', () => {
  it('search for clickable URL', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const composePage = new PatientComposePage();
    site.login();
    landingPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.get('[data-testid="compose-message-link"]').click();
    patientInterstitialPage.getContinueButton().click();
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.getCategory('COVID').click();
    composePage.getMessageSubjectField().type('Message with Clickable URL');
    composePage.getMessageBodyField().type('https://www.va.gov/');
    composePage.verifyClickableURLinMessageBody('https://www.va.gov/');
    composePage.sendMessage();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.verifySendMessageConfirmationMessage();
  });
});
