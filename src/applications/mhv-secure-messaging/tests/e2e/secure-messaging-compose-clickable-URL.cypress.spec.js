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

    PatientComposePage.interceptSentFolder();
    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click();
    cy.wait('@sentFolder');
    PatientInterstitialPage.getContinueButton().click();
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory(requestBodyUpdated.category);
    PatientComposePage.getMessageSubjectField().type(
      `${requestBodyUpdated.subject}`,
    );
    PatientComposePage.getMessageBodyField().type(
      `\n${requestBodyUpdated.body}`,
      { force: true },
    );
    PatientComposePage.verifyClickableURLinMessageBody(
      `${requestBodyUpdated.body}`,
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
