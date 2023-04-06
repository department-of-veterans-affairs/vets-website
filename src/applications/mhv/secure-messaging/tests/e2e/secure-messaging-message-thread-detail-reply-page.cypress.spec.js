import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('Secure Messaging Reply Message Details Thread', () => {
  it('Axe Check Message Reply Details', () => {
    const landingPage = new PatientInboxPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const messageDetailsPage = new PatientMessageDetailsPage();

    const site = new SecureMessagingSite();
    site.login();
    const testMessage = landingPage.getNewMessageDetails();
    landingPage.loadInboxMessages(mockMessages, testMessage);
    messageDetailsPage.loadMessageDetails(testMessage);
    messageDetailsPage.loadReplyPageDetails(testMessage);
    patientInterstitialPage.getContinueButton().click();
    messageDetailsPage.verifyExpandedMessageDateDisplay(testMessage);
    cy.contains('expand').click();
    messageDetailsPage.verifyExpandedMessageFromDisplay(testMessage);
    messageDetailsPage.verifyExpandedMessageIDDisplay(testMessage);
    messageDetailsPage.verifyExpandedMessageToDisplay(testMessage);
    messageDetailsPage.verifyUnexpandedMessageFromDisplay(testMessage);
    cy.injectAxe();
    cy.axeCheck();
  });
});
