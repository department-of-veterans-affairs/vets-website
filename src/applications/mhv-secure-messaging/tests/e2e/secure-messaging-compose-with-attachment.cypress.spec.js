import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Compose a new message with attachments', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });

  it('verify use can send a message with attachments', () => {
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

  it('verify use can delete attachment', () => {
    composePage.attachMessageFromFile(Data.SAMPLE_PDF);
    composePage.removeAttachedFile();

    cy.get(Locators.BLOCKS.ATTACHMENTS).should('not.be.visible');
  });
});

describe('verify attach file button behaviour', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });

  it('verify attach file button label change', () => {
    cy.get(Locators.BUTTONS.ATTACH_FILE)
      .shadow()
      .find('button')
      .should('have.text', 'Attach file');
    composePage.attachMessageFromFile(Data.SAMPLE_PDF);

    cy.get(Locators.BUTTONS.ATTACH_FILE)
      .shadow()
      .find('button')
      .should('have.text', 'Attach additional file');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify attach file button label change', () => {
    composePage.attachMessageFromFile(Data.SAMPLE_PDF);
    composePage.attachMessageFromFile(Data.SAMPLE_PDF);

    cy.get(Locators.ALERTS.ERROR_MESSAGE).should(
      'have.text',
      Data.ALREADY_ATTACHED_FILE,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify attach file button disappears', () => {
    const fileList = [
      Data.SAMPLE_XLS,
      Data.SAMPLE_IMG,
      Data.SAMPLE_DOC,
      Data.SAMPLE_PDF,
    ];

    composePage.attachFewFiles(fileList);

    cy.get(Locators.BUTTONS.ATTACH_FILE).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
