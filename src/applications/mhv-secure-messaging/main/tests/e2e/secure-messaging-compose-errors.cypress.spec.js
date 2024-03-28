import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('Secure Messaging Compose Errors', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });

  it('error message for no recipient', () => {
    composePage.selectCategory();
    composePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true });
    composePage.clickSendMessageButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    composePage.verifyFocusOnErrorMessage(Data.PLEASE_SELECT_RECIPIENT);
  });

  it('focus on error message for empty category', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    composePage.getMessageBodyField();
    composePage.clickSendMessageButton();
    composePage.verifyFocusOnErrorMessage(Data.PLEASE_SELECT_CATEGORY);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('focus on error message for empty message subject', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true });
    composePage.clickSendMessageButton();
    composePage.verifyFocusOnErrorMessage(Data.SUBJECT_CANNOT_BLANK);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('focus on error message for empty message body', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();
    composePage
      .getMessageSubjectField()
      .type(Data.TEST_SUBJECT, { force: true });
    composePage.clickSendMessageButton();
    composePage.verifyFocusOnErrorMessage('Message body cannot be blank.');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
