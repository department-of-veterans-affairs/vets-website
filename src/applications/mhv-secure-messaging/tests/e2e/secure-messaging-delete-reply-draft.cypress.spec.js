import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockMessages from './fixtures/messages-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Delete Reply Draft', () => {
  const currentDate = GeneralFunctionsPage.getDateFormat();
  it('verify user can delete draft on reply', () => {
    SecureMessagingSite.login();
    const messageDetails = PatientInboxPage.getNewMessageDetails();
    PatientInboxPage.loadInboxMessages(mockMessages, messageDetails);

    PatientMessageDetailsPage.loadMessageDetails(messageDetails);
    PatientMessageDetailsPage.loadReplyPageDetails(messageDetails);
    PatientInterstitialPage.getContinueButton().click();

    PatientReplyPage.getMessageBodyField().click();

    PatientReplyPage.getMessageBodyField().type(`Test Body`, {
      force: true,
    });

    PatientReplyPage.clickSaveReplyDraftButton(
      messageDetails,
      `\n\n\nName\nTitleTestTest Body`,
    );

    cy.get(Locators.ALERTS.SAVE_ALERT).should(
      'contain',
      `message was saved on ${currentDate}`,
    );

    PatientMessageDraftsPage.clickMultipleDeleteButton();
    PatientMessageDraftsPage.confirmDeleteDraft(messageDetails);
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    PatientMessageDraftsPage.verifyDraftMessageBannerTextHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
