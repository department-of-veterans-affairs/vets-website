import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging - Compose with Clickable URL', () => {
  it('search for clickable URL', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    site.login();
    landingPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    const requestBodyUpdated = {
      ...requestBody,
      body: 'https://www.va.gov/',
    };
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
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
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
