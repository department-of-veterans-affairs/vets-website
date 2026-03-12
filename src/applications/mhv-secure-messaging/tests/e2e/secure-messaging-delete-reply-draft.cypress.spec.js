import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientReplyPage from './pages/PatientReplyPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';
import singleThreadResponse from './fixtures/thread-response-new-api.json';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('SM DELETE REPLY DRAFT', () => {
  const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
    singleThreadResponse,
  );
  it('verify user can delete draft on reply', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();

    PatientReplyPage.getMessageBodyField().click({ force: true });

    PatientReplyPage.getMessageBodyField()
      .clear({ force: true })
      .type(`Test Body`, {
        force: true,
      });

    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.confirmDeleteDraft(updatedSingleThreadResponse);
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    PatientMessageDraftsPage.verifyDraftDeletedAlertAndH1Focus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
