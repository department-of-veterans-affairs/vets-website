import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('Secure Messaging navigate away from unsaved draft', () => {
  it(' Check navigation away from unsaved draft', () => {
    const messageDetailsPage = new PatientMessageDetailsPage();
    SecureMessagingSite.login();
    const testMessage = PatientInboxPage.getNewMessageDetails();
    PatientInboxPage.loadInboxMessages(mockMessages, testMessage);
    messageDetailsPage.loadMessageDetails(testMessage);
    messageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });
    PatientReplyPage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });

    FolderLoadPage.backToInbox();
    PatientReplyPage.verifyModalMessageDisplayAndButtonsCantSaveDraft();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
