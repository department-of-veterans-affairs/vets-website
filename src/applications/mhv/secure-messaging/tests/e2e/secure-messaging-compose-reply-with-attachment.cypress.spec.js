import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  it('compose reply with attachment', () => {
    const landingPage = new PatientMessagesLandingPage();
    const composePage = new PatientComposePage();
    landingPage.login();
    landingPage.loadPage(false);
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select('BLUE ANCILLARY_TEAM');
    cy.get('[name="COVID"]').click();
    composePage.attachMessageFromFile('test_video.mp4');
    composePage.verifyAttachmentErrorMessage(
      'File supported: doc, docx, gif, jpg, jpeg, pdf, png, rtf, txt, xls, xlsx',
    );
    composePage.closeAttachmentErrorPopup();
    composePage.attachMessageFromFile('test_image_10mb.jpg');
    composePage.verifyAttachmentErrorMessage(
      'File size for a single attachment cannot exceed 6MB',
    );
    composePage.closeAttachmentErrorPopup();
    composePage.attachMessageFromFile('sample_pdf.pdf');
    composePage.attachMessageFromFile('sample_docx.docx');
    composePage.attachMessageFromFile('sample_XLS.xls');
    composePage.attachMessageFromFile('test_image.gif');
    composePage.attachMessageFromFile('test_image.jpg');
    composePage.verifyAttachmentErrorMessage(
      'You may only attach up to 4 files',
    );
    composePage.closeAttachmentErrorPopup();
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]')
      .type('Test Subject');
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Test message body');
    composePage.sendMessage();
  });
});
