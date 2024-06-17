import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { AXE_CONTEXT, Data } from '../utils/constants';

describe('Secure Messaging Compose Errors Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });

  it('focus on error message for no provider', () => {
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
    PatientComposePage.pushSendMessageWithKeyboardPress();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientComposePage.verifyFocusOnErrorMessage(Data.PLEASE_SELECT_RECIPIENT);
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty category', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorMessage(Data.PLEASE_SELECT_CATEGORY);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientComposePage.selectCategory();
    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty message subject', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorMessage(Data.SUBJECT_CANNOT_BLANK);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientComposePage.getMessageSubjectField().type(
      Data.TEST_MESSAGE_SUBJECT,
      { force: true },
    );
    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty message body', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT, {
      force: true,
    });
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorMessage(Data.BODY_CANNOT_BLANK);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
  });
});
