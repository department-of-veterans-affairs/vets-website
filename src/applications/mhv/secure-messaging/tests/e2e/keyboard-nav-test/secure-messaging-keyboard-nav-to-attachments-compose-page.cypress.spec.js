import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';

describe('Secure Messaging Keyboard Nav to Attachment', () => {
  it('Keyboard Nav to Focus on Attachment', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    cy.tabToElement('#OTHEROTHER');
    cy.realPress(['Enter']);
    PatientComposePage.getMessageSubjectField().type('Test Attachment Focus');
    PatientComposePage.getMessageBodyField().type('Focus Attachment');
    PatientComposePage.attachMessageFromFile('test_image.jpg');
    PatientComposePage.verifyFocusonMessageAttachment();
    cy.injectAxe();
    cy.axeCheck();
  });
});
