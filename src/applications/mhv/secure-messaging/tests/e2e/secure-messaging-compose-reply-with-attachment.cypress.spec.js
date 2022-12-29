import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  it('can send message', () => {
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
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_video.mp4',
      { force: true },
    );

    cy.get('[data-testid="attach-file-error-modal"] p')
      .should(
        'have.text',
        'File supported: doc, docx, gif, jpg, jpeg, pdf, png, rtf, txt, xls, xlsx',
      )
      .should('be.visible');
    cy.get('[data-testid="attach-file-error-modal"]')
      .shadow()
      .find('[type="button"]')
      .first()
      .click();
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_image_10mb.jpg',
      { force: true },
    );
    cy.get('[data-testid="attach-file-error-modal"] p')
      .should(
        'have.text',
        'File size for a single attachment cannot exceed 6MB',
      )
      .should('be.visible');
    cy.get('[data-testid="attach-file-error-modal"]')
      .shadow()
      .find('[type="button"]')
      .first()
      .click();
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/sample_pdf.pdf',
      { force: true },
    );
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/sample_docx.docx',
      { force: true },
    );
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/sample_XLS.xls',
      { force: true },
    );
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_image.gif',
      { force: true },
    );
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_image.jpg',
      { force: true },
    );
    cy.get('[data-testid="attach-file-error-modal"] p')
      .should('have.text', 'You may only attach up to 4 files')
      .should('be.visible');
    cy.get('[data-testid="attach-file-error-modal"]')
      .shadow()
      .find('[type="button"]')
      .first()
      .click();

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
