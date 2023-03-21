import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';

describe('Compose message With Attacments and Errors', () => {
  it('compose message with attachment', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    cy.get('[name="COVID"]').click();
    composePage.attachMessageFromFile('test_video.mp4');
    composePage.verifyAttachmentErrorMessage(
      'File supported: doc, docx, gif, jpg, jpeg, pdf, png, rtf, txt, xls, xlsx',
    );
    composePage.closeAttachmentErrorPopup();
    composePage.attachMessageFromFile('test_image_10mb.jpg');
    composePage.verifyAttachmentErrorMessage(
      'File size for a single attachment cannot exceed 6MB.',
    );
    composePage.closeAttachmentErrorPopup();
    composePage.attachMessageFromFile('sample_pdf.pdf');
    composePage.attachMessageFromFile('sample_docx.docx');
    composePage.attachMessageFromFile('sample_XLS.xls');
    composePage.attachMessageFromFile('test_image.gif');
    // logic has changed here. After attaching 4th file, Attach File button becomes hidden
    cy.get('[data-testid="attach-file-input"]').should('not.exist');
    // composePage.verifyAttachmentErrorMessage(
    //   'You may only attach up to 4 files',
    // );
    // composePage.closeAttachmentErrorPopup();
    composePage.getMessageSubjectField().type('Test Subject');
    composePage.getMessageBodyField().type('Test message body');
    composePage.sendMessage();
  });
});
