import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT } from './utils/constants';

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
      .click();
    composePage.attachMessageFromFile('test_video.mp4');
    composePage.verifyAttachmentErrorMessage(
      "We can't attach this file type. Try attaching a DOC, JPG, PDF, PNG, RTF, TXT, or XLS.",
    );
    composePage.attachMessageFromFile('empty.txt');
    composePage.verifyAttachmentErrorMessage(
      'Your file is empty. Try attaching a different file.',
    );
    composePage.attachMessageFromFile('test_ext.TXT');

    // TO DO: remove attachment
    composePage.removeAttachMessageFromFile();

    composePage.getMessageSubjectField().type('Test Subject');
    composePage
      .getMessageBodyField()
      .type('Test message body', { force: true, waitforanimations: true });
    composePage.sendMessage();
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
