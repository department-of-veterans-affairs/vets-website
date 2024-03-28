import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientReplyPage from './pages/PatientReplyPage';

import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Reply Message Details Thread', () => {
  it('Axe Check Message Reply Details', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    const testMessage = landingPage.getNewMessageDetails();
    landingPage.loadInboxMessages(mockMessages, testMessage);
    messageDetailsPage.loadMessageDetails(testMessage);
    messageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });

    PatientReplyPage.verifyExpandedMessageDateDisplay(testMessage);

    cy.get(
      `[data-testid='expand-message-button-${
        testMessage.data.attributes.messageId
      }']`,
    ).click({ waitforanimations: true, multiple: true });
    PatientReplyPage.verifyExpandedMessageDateDisplay(testMessage);
    // messageDetailsPage.verifyExpandedMessageIDDisplay(testMessage); // TODO: Pending UCD decision if message ID should be displayed
    messageDetailsPage.verifyExpandedMessageToDisplay(testMessage);
    messageDetailsPage.verifyUnexpandedMessageFromDisplay(testMessage);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
