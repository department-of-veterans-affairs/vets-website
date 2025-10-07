import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators, Alerts } from './utils/constants';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import singleThreadResponse from './fixtures/thread-response-new-api.json';

const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
  singleThreadResponse,
);
describe('SM REPLY WITH ATTACHMENT', () => {
  const singleMessage = { data: updatedSingleThreadResponse.data[0] };
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();
  });

  it('verify user can send a reply with attachments', () => {
    PatientReplyPage.getMessageBodyField().type('\nTest message body', {
      force: true,
    });

    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientReplyPage.clickSendReplyMessageButton(singleMessage);
    PatientReplyPage.verifySendMessageConfirmationMessageText();
    PatientReplyPage.verifySendMessageConfirmationHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify attachments info', () => {
    const optList = Data.ATTACH_INFO;

    cy.get(Locators.INFO.ADDITIONAL_INFO)
      .contains(`attaching`)
      .click({ force: true });
    PatientComposePage.verifyAttachmentInfo(optList);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify user can delete attachment', () => {
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);

    PatientComposePage.verifyAttchedFilesList(1);

    PatientComposePage.removeAttachedFile();

    PatientComposePage.verifyAttchedFilesList(0);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM ATTACH FILE BUTTON BEHAVIOR', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();
  });

  it('verify attach file button label change', () => {
    PatientComposePage.attachFileButton()
      .shadow()
      .find('button')
      .should('have.text', 'Attach file');
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);

    PatientComposePage.attachFileButton()
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
      Alerts.ATTACHMENT.ALREADY_ATTACHED,
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

    PatientComposePage.attachFileButton().should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
