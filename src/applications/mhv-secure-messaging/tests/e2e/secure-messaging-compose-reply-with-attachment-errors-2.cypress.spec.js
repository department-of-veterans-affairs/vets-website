import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Start a new message With Attacments and Errors', () => {
  it('start a new message with attachment', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory('COVID');

    composePage.getMessageSubjectField();
    composePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true, waitforanimations: true });

    composePage.attachMessageFromFile(Data.SAMPLE_PDF);
    composePage.attachMessageFromFile(Data.SAMPLE_PDF);
    composePage.verifyAttachmentErrorMessage(Data.ALREADY_ATTACHED_FILE);

    composePage.attachMessageFromFile(Data.TEST_LARGE_IMAGE);
    composePage.verifyAttachmentErrorMessage(Data.FILE_IS_TOO_LARGE_TEXT);

    composePage.attachMessageFromFile(Data.SAMPLE_PDF);
    composePage.attachMessageFromFile(Data.SAMPLE_DOC);
    // Verify current attachments count
    composePage.verifyExpectedAttachmentsCount(2);
    composePage.attachMessageFromFile('sample_XLS.xls');
    composePage.attachMessageFromFile('test_image.gif');
    composePage.verifyExpectedAttachmentsCount(4);
    // logic has changed here. After attaching 4th file, Attach File button becomes hidden
    cy.get(Locators.ATTACH_FILE_INPUT).should('not.exist');
    // composePage.verifyAttachmentErrorMessage(
    //   'You may only attach up to 4 files',
    // );

    composePage.sendMessage();
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
