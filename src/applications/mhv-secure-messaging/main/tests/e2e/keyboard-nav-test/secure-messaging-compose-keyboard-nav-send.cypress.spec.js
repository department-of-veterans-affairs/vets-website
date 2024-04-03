import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Data } from '../utils/constants';

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
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();
    composePage.attachMessageFromFile(Data.TEST_IMAGE);
    composePage.getMessageSubjectField().click();
    composePage
      .getMessageSubjectField()
      .type(Data.TEST_SUBJECT, { force: true });
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true });
    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
