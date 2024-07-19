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
    SecureMessagingSite.login();
    const messageDetails = PatientInboxPage.getNewMessageDetails();

    PatientInboxPage.loadInboxMessages(mockMessages, messageDetails);
    PatientMessageDetailsPage.loadMessageDetails(messageDetails);
    PatientMessageDetailsPage.loadReplyPageDetails(messageDetails);
    PatientInterstitialPage.getContinueButton().click();
    const testMessageBody = 'Test body';
    PatientReplyPage.getMessageBodyField().click();
    PatientReplyPage.getMessageBodyField().type(testMessageBody, {
      force: true,
    });
    cy.realPress(['Enter']).then(() => {
      PatientReplyPage.clickSaveReplyDraftButton(
        messageDetails,
        `\n\n\nName\nTitleTest${testMessageBody}`,
      );
      cy.log(
        `the message details after clickSaveReplyDraftButton ${JSON.stringify(
          messageDetails,
        )}`,
      );
    });

    draftsPage.clickDeleteButton();
    draftsPage.confirmDeleteDraft(messageDetails);
    draftsPage.verifyDeleteConfirmationMessage();
    draftsPage.verifyDraftMessageBannerTextHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
