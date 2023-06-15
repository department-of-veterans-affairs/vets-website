import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    cy.get('[name="COVID"]').click();
    composePage.attachMessageFromFile('test_image.jpg');
    composePage.getMessageSubjectField().type('Test Subject');
    composePage.getMessageBodyField().type('Test message body');
    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifySendMessageConfirmationMessage();
    composePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
