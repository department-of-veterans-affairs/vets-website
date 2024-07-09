import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { AXE_CONTEXT, Data } from '../utils/constants';

// TODO error focus assertions should be refactored later
// Focus states go to interactive form fields (Select, text input, textarea, checkboxes, and radio buttons.)

describe('Secure Messaging Compose Errors Keyboard Nav', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
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
    PatientComposePage.verifyErrorText(Data.PLEASE_SELECT_RECIPIENT);
    PatientComposePage.verifyFocusOnErrorMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty category', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyErrorText(Data.PLEASE_SELECT_CATEGORY);
    PatientComposePage.verifyFocusOnErrorMessage();

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
    PatientComposePage.verifyErrorText(Data.SUBJECT_CANNOT_BLANK);
    PatientComposePage.verifyFocusOnErrorMessage();

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
    PatientComposePage.verifyErrorText(Data.BODY_CANNOT_BLANK);
    PatientComposePage.verifyFocusOnErrorMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
  });
});
