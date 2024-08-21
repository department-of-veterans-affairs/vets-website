import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('Start a new message With Attacments and Errors', () => {
  it('start a new message with attachment', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.attachMessageFromFile(Data.TEST_VIDEO);
    PatientComposePage.verifyAttachmentErrorMessage(
      "We can't attach this file type. Try attaching a DOC, DOCX, GIF, JPG, PDF, PNG, RTF, TXT, XLS XLSX, JPEG, JFIF, PJPEG, or PJP.",
    );
    PatientComposePage.attachMessageFromFile('empty.txt');
    PatientComposePage.verifyAttachmentErrorMessage(
      'Your file is empty. Try attaching a different file.',
    );
    PatientComposePage.attachMessageFromFile('test_ext.TXT');
    PatientComposePage.removeAttachedFile();

    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
      waitforanimations: true,
    });
    PatientComposePage.sendMessage();
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
