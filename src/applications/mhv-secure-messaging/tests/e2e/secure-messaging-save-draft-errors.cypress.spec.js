import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data } from './utils/constants';

// TODO error focus assertions should be refactored later
// Focus states go to interactive form fields (Select, text input, textarea, checkboxes, and radio buttons.)

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
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientComposePage.verifyFocusOnErrorMessage(Data.PLEASE_SELECT_RECIPIENT);
  });

  it('focus on error message for empty category', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField();
    PatientComposePage.clickSaveDraftButton();
    PatientComposePage.verifyFocusOnErrorMessage(Data.PLEASE_SELECT_CATEGORY);
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
    PatientComposePage.verifyFocusOnErrorMessage(Data.SUBJECT_CANNOT_BLANK);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it.skip('focus on error message for empty message body', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT, {
      force: true,
    });
    PatientComposePage.clickSaveDraftButton();
    PatientComposePage.verifyFocusOnErrorMessage(
      'Message body cannot be blank.',
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
