import mockSingleDraft from './fixtures/draftPageResponses/single-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Delete Draft', () => {
  it(' Delete Existing Draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    PatientInterstitialPage.getContinueButton().should('not.exist');
    PatientMessageDraftsPage.clickDeleteButton();

    PatientMessageDraftsPage.confirmDeleteDraft(mockSingleDraft);
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    PatientMessageDraftsPage.verifyDeleteConfirmationButton();
    PatientMessageDraftsPage.verifyDraftMessageBannerTextHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
