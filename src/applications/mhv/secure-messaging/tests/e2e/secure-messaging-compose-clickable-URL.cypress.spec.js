import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging - Compose with Clickable URL', () => {
  it('search for clickable URL', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    site.login();
    landingPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
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
    PatientInterstitialPage.getContinueButton().click();
    composePage.selectRecipient(requestBodyUpdated.recipientId);
    composePage
      .getCategory(requestBodyUpdated.category)
      .first()
      .click();
    composePage.getMessageSubjectField().type(`${requestBodyUpdated.subject}`);
    composePage
      .getMessageBodyField()
      .type(`${requestBodyUpdated.body}`, { force: true });
    composePage.verifyClickableURLinMessageBody('https://www.va.gov/');
    cy.injectAxe();
  });
});
