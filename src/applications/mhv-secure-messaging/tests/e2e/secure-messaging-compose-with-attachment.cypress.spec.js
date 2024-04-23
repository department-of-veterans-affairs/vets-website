import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Compose a new message With Attacments and Errors', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });

  it('compose and send a new message with attachment', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory('COVID');
    composePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true, waitforanimations: true });
    composePage.attachMessageFromFile(Data.SAMPLE_PDF);
    composePage.sendMessage();
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify attachments info', () => {
    const optList = Data.ATTACH_INFO;

    cy.get(Locators.INFO.ATTACH_INFO).click({ force: true });
    composePage.verifyAttachmentInfo(optList);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify attach file button behaviour', () => {
    // const fileList = ['file.jpg', 'file.pdf', 'file.doc']
    cy.get(Locators.BUTTONS.ATTACH_FILE)
      .shadow()
      .find('button')
      .should('have.text', 'Attach file');
    composePage.attachMessageFromFile(Data.SAMPLE_PDF);

    cy.get(Locators.BUTTONS.ATTACH_FILE)
      .shadow()
      .find('button')
      .should('have.text', 'Attach additional file');

    composePage.attachMessageFromFile(Data.SAMPLE_PDF);
    cy.get(Locators.ALERTS.ERROR_MESSAGE).should(
      'have.text',
      Data.ALREADY_ATTACHED_FILE,
    );

    // composePage.attachFewFiles(fileList)

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
