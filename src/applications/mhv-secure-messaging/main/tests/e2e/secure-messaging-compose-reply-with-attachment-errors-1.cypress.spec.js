import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data } from './utils/constants';

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
    composePage
      .getCategory('COVID')
      .first()
      .click({ force: true });
    composePage.attachMessageFromFile(Data.TEST_VIDEO);
    composePage.verifyAttachmentErrorMessage(
      "We can't attach this file type. Try attaching a DOC, DOCX, GIF, JPG, PDF, PNG, RTF, TXT, XLS XLSX, JPEG, JFIF, PJPEG, or PJP.",
    );
    composePage.attachMessageFromFile('empty.txt');
    composePage.verifyAttachmentErrorMessage(
      'Your file is empty. Try attaching a different file.',
    );
    composePage.attachMessageFromFile('test_ext.TXT');

    // TO DO: remove attachment
    composePage.removeAttachMessageFromFile();

    composePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true, waitforanimations: true });
    composePage.sendMessage();
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
