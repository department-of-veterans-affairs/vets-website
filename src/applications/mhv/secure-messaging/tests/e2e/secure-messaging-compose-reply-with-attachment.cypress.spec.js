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

    // logic has changed here. After attaching 4th file, Attach File button becomes hidden

    // composePage.verifyAttachmentErrorMessage(
    //   'You may only attach up to 4 files',
    // );
    composePage.getMessageSubjectField().type('Test Subject', { force: true });
    composePage
      .getMessageBodyField()
      .type('Test message body', { force: true, waitforanimations: true });
    composePage.attachMessageFromFile('sample_pdf.pdf');
    composePage.sendMessage();

    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
