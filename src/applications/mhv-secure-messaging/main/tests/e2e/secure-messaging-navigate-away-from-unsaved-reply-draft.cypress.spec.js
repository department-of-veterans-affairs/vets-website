import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Secure Messaging navigate away from unsaved draft', () => {
  it(' Check navigatation away from unsaved draft', () => {
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
    PatientReplyPage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });

    cy.get(Locators.FOLDERS.INBOX).click();
    PatientReplyPage.verifyModalMessageDisplayAndButtonsCantSaveDraft();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
