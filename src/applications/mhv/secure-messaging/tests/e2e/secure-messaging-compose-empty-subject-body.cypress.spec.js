import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';

describe('Secure Messaging Compose with No Subject or Body', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4'); // trieageTeams with preferredTeam = true will appear in a recipients dropdown only
    PatientComposePage.getCategory('COVID').click();
    PatientComposePage.attachMessageFromFile('test_image.jpg');
  });
  it('empty message subject error', () => {
    PatientComposePage.getMessageBodyField().type('Test message body');
    PatientComposePage.clickOnSendMessageButton();
    PatientComposePage.verifySubjectErrorMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('empty message body error', () => {
    PatientComposePage.getMessageSubjectField().type('Test Subject');
    PatientComposePage.clickOnSendMessageButton();
    PatientComposePage.verifyBodyErrorMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
