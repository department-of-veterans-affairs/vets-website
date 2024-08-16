import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    SecureMessagingSite.login();
    const testMessage = PatientInboxPage.getNewMessageDetails();
    PatientInboxPage.loadInboxMessages(mockMessages, testMessage);

    PatientMessageDetailsPage.loadMessageDetails(testMessage);
    PatientMessageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });
    PatientReplyPage.getMessageBodyField().type('\nTest message body', {
      force: true,
    });
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientReplyPage.clickSendReplyMessageDetailsButton(testMessage);
    cy.get(Locators.SPINNER).should('be.visible');
    PatientReplyPage.verifySendMessageConfirmationMessageText();
    PatientReplyPage.verifySendMessageConfirmationHasFocus();
    cy.get(Locators.SPINNER).should('not.exist');
  });
});
