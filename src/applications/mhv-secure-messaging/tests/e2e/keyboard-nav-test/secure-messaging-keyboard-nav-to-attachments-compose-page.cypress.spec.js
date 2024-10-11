import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Data } from '../utils/constants';
import requestBody from '../fixtures/message-compose-request-body.json';

// TODO rename describe and it (kb nav and focusing)

describe('Secure Messaging Keyboard Nav to Attachment', () => {
  it('Keyboard Nav to Focus on Attachment', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(`${requestBody.category}`);
    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`, {
      force: true,
    });

    // TODO imitate kb nav to Attach file btn

    // verify attachments button has "Attach file" with no attachments
    PatientComposePage.verifyAttachmentButtonText(0);
    PatientComposePage.attachMessageFromFile(Data.TEST_IMAGE);
    PatientComposePage.verifyFocusOnAttachmentMessage();

    // // verify attachments button has "Attach additional file" with one or more attachments
    // PatientComposePage.verifyAttachmentButtonText(1);
    // PatientComposePage.attachMessageFromFile(Data.SAMPLE_DOC);
    // PatientComposePage.verifyFocusOnMessageAttachment();
    //
    // cy.realPress('Enter');
    //
    // // After closing the attachment banner, first attachment remove button has focus
    // PatientComposePage.verifyRemoveAttachmentButtonHasFocus(0);
    //
    // PatientComposePage.sendMessage();
    // PatientComposePage.verifySendMessageConfirmationMessageText();
    // PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
    //
    // PatientComposePage.verifyHeader('Inbox');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
