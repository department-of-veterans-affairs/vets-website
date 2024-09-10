import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { AXE_CONTEXT, Data } from '../utils/constants';

// focus validation temporary commented due to focus error (will be fixed in MHV-61146)
describe('Secure Messaging Compose Errors Keyboard Nav', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });
  afterEach(() => {
    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for no provider', () => {
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyErrorText(Data.PLEASE_SELECT_RECIPIENT);
    // PatientComposePage.verifyFocusOnErrorMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.selectRecipient();
  });

  it('focus on error message for empty category', () => {
    PatientComposePage.selectRecipient();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyErrorText(Data.PLEASE_SELECT_CATEGORY);
    // PatientComposePage.verifyFocusOnErrorMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    // PatientComposePage.selectCategory();
  });

  it('focus on error message for empty message subject', () => {
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyErrorText(Data.SUBJECT_CANNOT_BLANK);
    // PatientComposePage.verifyFocusOnErrorMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.getMessageSubjectField().type(Data.TEST_MESSAGE_SUBJECT);
  });

  it('focus on error message for empty message body', () => {
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT, {
      force: true,
    });
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyErrorText(Data.BODY_CANNOT_BLANK);
    // PatientComposePage.verifyFocusOnErrorMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
  });
});
