import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';
import mockMessages from './fixtures/messages-response.json';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';

describe('Reply with attachments', () => {
  const testMessage = PatientInboxPage.getNewMessageDetails();
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages, testMessage);

    PatientMessageDetailsPage.loadMessageDetails(testMessage);
    PatientMessageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });
  });

  it('verify use can send a reply with attachments', () => {
    PatientReplyPage.getMessageBodyField().type('\nTest message body', {
      force: true,
    });

    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientReplyPage.clickSendReplyMessageDetailsButton(testMessage);
    PatientReplyPage.verifySendMessageConfirmationMessageText();
    PatientReplyPage.verifySendMessageConfirmationHasFocus();

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
  const testMessage = PatientInboxPage.getNewMessageDetails();
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages, testMessage);

    PatientMessageDetailsPage.loadMessageDetails(testMessage);
    PatientMessageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });
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
