import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientReplyPage from './pages/PatientReplyPage';

import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Reply Message Details Thread', () => {
  it('Axe Check Message Reply Details', () => {
    SecureMessagingSite.login();
    const testMessage = PatientInboxPage.getNewMessageDetails();
    PatientInboxPage.loadInboxMessages(mockMessages, testMessage);
    PatientMessageDetailsPage.loadMessageDetails(testMessage);
    PatientMessageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });

    PatientReplyPage.verifyExpandedMessageDate(testMessage);
    cy.get(
      `[data-testid='expand-message-button-${
        testMessage.data.attributes.messageId
      }']`,
    ).click({ waitforanimations: true, multiple: true });
    PatientReplyPage.verifyExpandedMessageDate(testMessage);
    PatientMessageDetailsPage.verifyExpandedMessageId(testMessage);
    PatientMessageDetailsPage.verifyExpandedMessageTo(testMessage);
    PatientMessageDetailsPage.verifyUnexpandedMessageFrom(testMessage);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
