import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientReplyPage from './pages/PatientReplyPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Reply Message Details Thread', () => {
  it('Axe Check Message Reply Details', () => {
    SecureMessagingSite.login();
    const testMessage = PatientInboxPage.getNewMessageDetails();
    PatientInboxPage.loadInboxMessages(mockMessages, testMessage);
    PatientMessageDetailsPage.loadMessageDetails(testMessage);
    PatientMessageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitforanimations: true,
    });

    PatientReplyPage.verifyExpandedMessageDateDisplay(testMessage);

    cy.get(
      `[data-testid='expand-message-button-${
        testMessage.data.attributes.messageId
      }']`,
    ).click({ waitforanimations: true });
    PatientReplyPage.verifyExpandedMessageDateDisplay(testMessage);
    // messageDetailsPage.verifyExpandedMessageIDDisplay(testMessage); // TODO: Pending UCD decision if message ID should be displayed
    PatientMessageDetailsPage.verifyExpandedMessageToDisplay(testMessage);
    PatientMessageDetailsPage.verifyUnexpandedMessageFromDisplay(testMessage);
    cy.injectAxe();
    cy.axeCheck();
  });
});
