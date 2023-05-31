import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    cy.get('[name="COVID"]').click();
    PatientComposePage.attachMessageFromFile('test_image.jpg');
    PatientComposePage.getMessageSubjectField().type('Test Subject');
    PatientComposePage.getMessageBodyField().type('Test message body');
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifySendMessageConfirmationMessage();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
