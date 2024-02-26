import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockSignature from './fixtures/signature-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/signature',
      mockSignature,
    ).as('signature');
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4', {
      force: true,
    });
    cy.get(`[name="compose-message-categories"][value=COVID]`)
      .first()
      .click();
    composePage.attachMessageFromFile('test_image.jpg', { force: true });
    composePage.getMessageSubjectField().type('Test Subject', { force: true });
    composePage
      .getMessageBodyField()
      .type('Test message body', { force: true });
    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifySendMessageConfirmationMessageText();
    // landingPage.verifyInboxHeader('Inbox');
  });
});
