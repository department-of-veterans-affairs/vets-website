import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Data } from '../utils/constants';

describe('Secure Messaging Compose Errors Keyboard Nav', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });
  afterEach(() => {
    PatientComposePage.deleteUnsavedDraft();
  });

  it('focus on error message for no provider', () => {
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    PatientComposePage.sendMessageByKeyboard();
    PatientComposePage.verifyErrorText(Data.PLEASE_SELECT_RECIPIENT);
    PatientComposePage.verifyFocusOnErrorMessage('SELECT');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.selectRecipient();
  });

  it('focus on error message for empty category', () => {
    PatientComposePage.selectRecipient();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    PatientComposePage.sendMessageByKeyboard();
    PatientComposePage.verifyErrorText(Data.PLEASE_SELECT_CATEGORY);
    PatientComposePage.verifyFocusOnErrorMessage('INPUT');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.selectCategory();
  });

  it('focus on error message for empty message subject', () => {
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    PatientComposePage.sendMessageByKeyboard();
    PatientComposePage.verifyErrorText(Data.SUBJECT_CANNOT_BLANK);
    PatientComposePage.verifyFocusOnErrorMessage('INPUT');

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
    PatientComposePage.sendMessageByKeyboard();
    PatientComposePage.verifyErrorText(Data.BODY_CANNOT_BLANK);
    PatientComposePage.verifyFocusOnErrorMessage('TEXTAREA');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
  });
});
