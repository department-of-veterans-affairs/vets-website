import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockMessages from './fixtures/messages-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Delete Reply Draft', () => {
  it('Axe Check Message Delete Reply Draft with Axe Check', () => {
    const draftsPage = new PatientMessageDraftsPage();
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();

    landingPage.loadInboxMessages(mockMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails);
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    PatientInterstitialPage.getContinueButton().click();
    const testMessageBody = 'Test body';
    PatientReplyPage.getMessageBodyField().click();
    PatientReplyPage.getMessageBodyField().type(testMessageBody, {
      force: true,
    });
    cy.realPress(['Enter']).then(() => {
      PatientReplyPage.saveReplyDraft(
        messageDetails,
        `\n\n\nName\nTitleTest${testMessageBody}`,
      );
      cy.log(
        `the message details after saveReplyDraft ${JSON.stringify(
          messageDetails,
        )}`,
      );
    });
    draftsPage.clickDeleteButton();
    draftsPage.confirmDeleteDraft(messageDetails);
    draftsPage.verifyDeleteConfirmationMessage();
    draftsPage.verifyDraftMessageBannerTextHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
