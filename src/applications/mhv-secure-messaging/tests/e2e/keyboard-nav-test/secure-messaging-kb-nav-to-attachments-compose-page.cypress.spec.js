import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Data } from '../utils/constants';
import requestBody from '../fixtures/message-compose-request-body.json';

describe('Secure Messaging Keyboard Nav to Attachment', () => {
  it('Keyboard Nav to Focus on Attachment', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.interceptSentFolder();

    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(`${requestBody.category}`);
    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().type(
      `{moveToStart}${requestBody.body}`,
      {
        force: true,
      },
    );

    PatientComposePage.verifyAttachmentButtonText(0);
    PatientComposePage.attachMessageFromFile(Data.TEST_IMAGE);
    cy.tabToElement(`[data-testid="attach-file-button"]`);
    PatientComposePage.verifyAttachButtonHasFocus();

    PatientComposePage.verifyAttachmentButtonText(1);
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_DOC);
    PatientComposePage.verifyAttachButtonHasFocus();

    PatientComposePage.sendMessage();
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();

    PatientComposePage.verifyHeader('Messages: Inbox');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
