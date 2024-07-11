import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import PatientComposePage from './pages/PatientComposePage';

describe('Secure Messaging Reply', () => {
  it('Navigate Away From `Reply to message` To Inbox', () => {
    const messageDetailsPage = new PatientMessageDetailsPage();
    SecureMessagingSite.login();
    const testMessage = PatientInboxPage.getNewMessageDetails();
    PatientInboxPage.loadInboxMessages(mockMessages, testMessage);
    messageDetailsPage.loadMessageDetails(testMessage);
    messageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });

    cy.get('#input-type-textarea').type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });

    FolderLoadPage.backToInbox();
    PatientReplyPage.verifyModalMessageDisplayAndButtonsCantSaveDraft();

    PatientComposePage.clickOnContinueEditingButton();
    PatientReplyPage.getMessageBodyField().should(
      'have.value',
      `\n\n\nName\nTitleTest${Data.TEST_MESSAGE_BODY}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
