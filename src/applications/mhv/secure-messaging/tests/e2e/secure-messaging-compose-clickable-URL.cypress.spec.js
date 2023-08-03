import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import requestBody from './fixtures/message-compose-request-body.json';

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
    const requestBodyUpdated = {
      ...requestBody,
      body: 'https://www.va.gov/',
    };
    cy.get('[data-testid="compose-message-link"]').click();
    patientInterstitialPage.getContinueButton().click();
    composePage.selectRecipient(requestBodyUpdated.recipientId);
    composePage.getCategory(requestBodyUpdated.category).click();
    composePage.getMessageSubjectField().type(`${requestBodyUpdated.subject}`);
    composePage.getMessageBodyField().type(`${requestBodyUpdated.body}`);
    composePage.verifyClickableURLinMessageBody('https://www.va.gov/');
    composePage.sendMessage(requestBodyUpdated);
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
