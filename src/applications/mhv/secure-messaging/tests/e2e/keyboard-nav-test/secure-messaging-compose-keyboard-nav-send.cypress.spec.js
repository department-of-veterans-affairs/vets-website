import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Compose', () => {
  it('verify user can send message with keyboard', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.attachMessageFromFile('test_image.jpg');
    composePage.getMessageSubjectField().click();
    composePage.getMessageSubjectField().type('Test Subject', { force: true });
    composePage
      .getMessageBodyField()
      .type('Test message body', { force: true });
    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
