import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('Secure Messaging Compose Errors', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });

  it('error message for no recipient', () => {
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
    PatientComposePage.clickSaveDraftButton();

    PatientComposePage.verifyErrorText(Data.PLEASE_SELECT_RECIPIENT);
    PatientComposePage.verifyFocusOnErrorMessage('SELECT');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('focus on error message for empty category', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField();
    PatientComposePage.clickSaveDraftButton();

    PatientComposePage.verifyErrorText(Data.PLEASE_SELECT_CATEGORY);
    PatientComposePage.verifyFocusOnErrorMessage('INPUT');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('focus on error message for empty message subject', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
    PatientComposePage.clickSaveDraftButton();

    PatientComposePage.verifyErrorText(Data.SUBJECT_CANNOT_BLANK);
    PatientComposePage.verifyFocusOnErrorMessage('INPUT');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('focus on error message for empty message body', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT, {
      force: true,
    });
    PatientComposePage.clickSaveDraftButton();

    PatientComposePage.verifyErrorText(Data.BODY_CANNOT_BLANK);
    PatientComposePage.verifyFocusOnErrorMessage('TEXTAREA');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
