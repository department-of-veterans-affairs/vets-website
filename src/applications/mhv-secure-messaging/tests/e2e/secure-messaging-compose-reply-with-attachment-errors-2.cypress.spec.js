import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Start a new message With Attacments and Errors', () => {
  it('start a new message with attachment', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory('COVID');

    PatientComposePage.getMessageSubjectField();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
      waitforanimations: true,
    });

    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientComposePage.verifyAttachmentErrorMessage(Data.ALREADY_ATTACHED_FILE);

    PatientComposePage.attachMessageFromFile(Data.TEST_LARGE_IMAGE);
    PatientComposePage.verifyAttachmentErrorMessage(
      Data.FILE_IS_TOO_LARGE_TEXT,
    );

    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_DOC);

    // Verify current attachments count
    PatientComposePage.verifyExpectedAttachmentsCount(2);
    PatientComposePage.attachMessageFromFile('sample_XLS.xls');
    PatientComposePage.attachMessageFromFile('test_image.gif');
    PatientComposePage.verifyExpectedAttachmentsCount(4);

    // logic has changed here. After attaching 4th file, Attach File button becomes hidden
    cy.get(Locators.ATTACH_FILE_INPUT).should('not.exist');

    // PatientComposePage.verifyAttachmentErrorMessage(
    //   'You may only attach up to 4 files',
    // );

    PatientComposePage.sendMessage();
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
