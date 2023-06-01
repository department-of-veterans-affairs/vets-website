import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';

describe('Start a new message With Attacments and Errors', () => {
  it('start a new message with attachment', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.getCategory('COVID').click();
    PatientComposePage.attachMessageFromFile('test_video.mp4');
    PatientComposePage.verifyAttachmentErrorMessage(
      "We can't attach this file type. Try attaching a DOC, JPG, PDF, PNG, RTF, TXT, or XLS.",
    );
    PatientComposePage.attachMessageFromFile('empty.txt');
    PatientComposePage.verifyAttachmentErrorMessage(
      'Your file is empty. Try attaching a different file.',
    );
    PatientComposePage.attachMessageFromFile('test_ext.TXT');

    // TO DO: remove attachment
    PatientComposePage.removeAttachMessageFromFile();

    PatientComposePage.attachMessageFromFile('sample_pdf.pdf');
    PatientComposePage.attachMessageFromFile('sample_pdf.pdf');
    PatientComposePage.verifyAttachmentErrorMessage(
      'You have already attached this file.',
    );

    PatientComposePage.attachMessageFromFile('test_image_10mb.jpg');
    PatientComposePage.verifyAttachmentErrorMessage(
      'Your file is too large. Try attaching a file smaller than 6MB.',
    );

    PatientComposePage.attachMessageFromFile('sample_pdf.pdf');
    PatientComposePage.attachMessageFromFile('sample_docx.docx');
    PatientComposePage.attachMessageFromFile('sample_XLS.xls');
    PatientComposePage.attachMessageFromFile('test_image.gif');
    // logic has changed here. After attaching 4th file, Attach File button becomes hidden
    cy.get('[data-testid="attach-file-input"]').should('not.exist');
    // PatientComposePage.verifyAttachmentErrorMessage(
    //   'You may only attach up to 4 files',
    // );
    PatientComposePage.getMessageSubjectField().type('Test Subject');
    PatientComposePage.getMessageBodyField().type('Test message body');
    PatientComposePage.sendMessage();
    PatientComposePage.verifySendMessageConfirmationMessage();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
