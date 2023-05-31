import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';

describe('Secure Messaging Compose Errors Keyboard Nav', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
  });

  it('focus on error message for no provider', () => {
    PatientComposePage.getCategory('COVID');

    PatientComposePage.getMessageSubjectField().type('Test Subject');
    PatientComposePage.getMessageBodyField().type('Test Message Body');
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorMessageToSelectRecipient();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('focus on error message for empty category', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');

    PatientComposePage.getMessageSubjectField().type('Test Subject');
    PatientComposePage.getMessageBodyField().type('Test Message Body');
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorMessageToSelectCategory();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('focus on error message for empty message subject', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageBodyField().type('Test Message Body');
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorEmptyMessageSubject();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('focus on error message for empty message body', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type('Test Subject');
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorEmptyMessageBody();
    cy.injectAxe();
    cy.axeCheck();
  });
});
