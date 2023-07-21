import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';

describe('Start a new message With Attacments and Errors', () => {
  it('start a new message with attachment', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.getCategory('COVID').click();
    it('test invaled attacement message', () => {
      composePage.attachMessageFromFile('test_video.mp4');
      composePage.verifyAttachmentErrorMessage(
        "We can't attach this file type. Try attaching a DOC, JPG, PDF, PNG, RTF, TXT, or XLS.",
      );
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
    it('test empty file attacement message', () => {
      composePage.attachMessageFromFile('empty.txt');
      composePage.verifyAttachmentErrorMessage(
        'Your file is empty. Try attaching a different file.',
      );
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
    it('test already attached message', () => {
      composePage.attachMessageFromFile('sample_pdf.pdf');
      composePage.attachMessageFromFile('sample_pdf.pdf');
      composePage.verifyAttachmentErrorMessage(
        'You have already attached this file.',
      );

      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
    it('test file too large attached message', () => {
      composePage.attachMessageFromFile('test_image_10mb.jpg');
      composePage.verifyAttachmentErrorMessage(
        'Your file is too large. Try attaching a file smaller than 6MB.',
      );
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
    it('test max uplod file', () => {
      composePage.attachMessageFromFile('sample_pdf.pdf');
      composePage.attachMessageFromFile('sample_docx.docx');
      composePage.attachMessageFromFile('sample_XLS.xls');
      composePage.attachMessageFromFile('test_image.gif');
      cy.get('[data-testid="attach-file-input"]').should('not.exist');
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });

    composePage.getMessageSubjectField().type('Test Subject');
    composePage.getMessageBodyField().type('Test message body');
    composePage.sendMessage();
    composePage.verifySendMessageConfirmationMessage();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
