import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT } from '../utils/constants';
import requestBody from '../fixtures/message-compose-request-body.json';

describe('Secure Messaging Keyboard Nav to Attachment', () => {
  it('Keyboard Nav to Focus on Attachment', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    composePage.selectRecipient(requestBody.recipientId);
    composePage.selectCategory(`${requestBody.category}`);
    // cy.tabToElement('#OTHEROTHERinput');
    // cy.realPress(['Enter']);
    composePage
      .getMessageSubjectField()
      .type(`${requestBody.subject}`, { force: true });
    composePage
      .getMessageBodyField()
      .type(`${requestBody.body}`, { force: true });
    // verify attachments button has "Attach file" with no attachments
    composePage.verifyAttachmentButtonText(0);
    composePage.attachMessageFromFile('test_image.jpg');
    composePage.verifyFocusOnMessageAttachment();
    // verify attachments button has "Attach additional file" with one or more attachments
    composePage.verifyAttachmentButtonText(1);
    composePage.attachMessageFromFile('sample_docx.docx');
    composePage.verifyFocusOnMessageAttachment();
    //
    cy.realPress('Enter');
    // After closing the attachment banner, first attachment remove button has focus
    composePage.verifyRemoveAttachmentButtonHasFocus(0);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.sendMessage();
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
