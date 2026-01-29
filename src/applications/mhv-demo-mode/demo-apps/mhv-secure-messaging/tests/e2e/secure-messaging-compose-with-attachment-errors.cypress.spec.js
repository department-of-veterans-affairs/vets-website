import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientErrorPage from './pages/PatientErrorPage';
import { AXE_CONTEXT, Data, Alerts, Locators } from './utils/constants';

describe('Verify compose message attachments errors', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory('COVID');
  });

  it('verify attachments types error', () => {
    PatientComposePage.attachMessageFromFile(Data.TEST_VIDEO);
    PatientErrorPage.verifyAttachmentErrorMessage(Alerts.ATTACHMENT.TYPES);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify empty attachment error', () => {
    PatientComposePage.attachMessageFromFile('empty.txt');
    PatientErrorPage.verifyAttachmentErrorMessage(Alerts.ATTACHMENT.EMPTY);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify already attached file error', () => {
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);

    PatientErrorPage.verifyAttachmentErrorMessage(
      Alerts.ATTACHMENT.ALREADY_ATTACHED,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify large attachment error`, () => {
    PatientComposePage.attachMessageFromFile(Data.TEST_LARGE_IMAGE);
    PatientErrorPage.verifyAttachmentErrorMessage(
      Alerts.ATTACHMENT.VISTA_TOO_LARGE,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify attach button disappear after 4 files attached`, () => {
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_DOC);
    PatientComposePage.verifyExpectedAttachmentsCount(2);

    PatientComposePage.attachMessageFromFile(Data.SAMPLE_XLS);
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_IMG);
    PatientComposePage.verifyExpectedAttachmentsCount(4);

    cy.get(Locators.ATTACH_FILE_INPUT).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
