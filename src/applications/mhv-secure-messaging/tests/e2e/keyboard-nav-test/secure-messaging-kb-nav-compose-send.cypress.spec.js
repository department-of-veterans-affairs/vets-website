import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Data } from '../utils/constants';

describe('Secure Messaging Compose', () => {
  it('verify user can send message with keyboard', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();
    PatientInboxPage.navigateToComposePage();

    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.attachMessageFromFile(Data.TEST_IMAGE);
    PatientComposePage.getMessageSubjectField().click();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
    PatientComposePage.sendMessageByKeyboard();
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
    PatientComposePage.verifyHeader('Messages: Inbox');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
