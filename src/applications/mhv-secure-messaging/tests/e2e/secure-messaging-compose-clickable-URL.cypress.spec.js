import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging - Compose with Clickable URL', () => {
  it('search for clickable URL', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    const requestBodyUpdated = {
      ...requestBody,
      body: 'https://www.va.gov/',
    };
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
    PatientInterstitialPage.getContinueButton().click();
    PatientComposePage.selectRecipient(requestBodyUpdated.recipientId);
    PatientComposePage.selectCategory(requestBodyUpdated.category);
    PatientComposePage.getMessageSubjectField().type(
      `${requestBodyUpdated.subject}`,
    );
    PatientComposePage.getMessageBodyField().type(
      `${requestBodyUpdated.body}`,
      { force: true },
    );
    PatientComposePage.verifyClickableURLinMessageBody('https://www.va.gov/');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
