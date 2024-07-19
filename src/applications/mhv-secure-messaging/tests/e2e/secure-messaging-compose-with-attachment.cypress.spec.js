import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Compose a new message with attachments', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });

  it('verify use can send a message with attachments', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
      waitforanimations: true,
    });
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientComposePage.sendMessage();
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify attachments info', () => {
    const optList = Data.ATTACH_INFO;

    cy.get(Locators.INFO.ATTACH_INFO).click({ force: true });
    PatientComposePage.verifyAttachmentInfo(optList);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify use can delete attachment', () => {
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientComposePage.removeAttachedFile();

    cy.get(Locators.BLOCKS.ATTACHMENTS).should('not.be.visible');
  });
});

describe('verify attach file button behaviour', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });

  it('verify attach file button label change', () => {
    cy.get(Locators.BUTTONS.ATTACH_FILE)
      .shadow()
      .find('button')
      .should('have.text', 'Attach file');
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);

    cy.get(Locators.BUTTONS.ATTACH_FILE)
      .shadow()
      .find('button')
      .should('have.text', 'Attach additional file');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify already attached file error', () => {
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);

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

    PatientComposePage.attachFewFiles(fileList);

    cy.get(Locators.BUTTONS.ATTACH_FILE).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
