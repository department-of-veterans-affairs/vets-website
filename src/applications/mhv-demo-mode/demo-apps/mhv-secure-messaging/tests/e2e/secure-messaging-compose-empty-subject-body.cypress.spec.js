import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('Secure Messaging Compose with No Subject or Body', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4'); // trieageTeams with preferredTeam = true will appear in a recipients dropdown only
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.attachMessageFromFile(Data.TEST_IMAGE);
  });

  it('empty message subject error', () => {
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
    PatientComposePage.clickOnSendMessageButton();
    PatientComposePage.verifySubjectErrorMessage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('empty message body error', () => {
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.clickOnSendMessageButton();
    PatientComposePage.verifyBodyErrorMessage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
