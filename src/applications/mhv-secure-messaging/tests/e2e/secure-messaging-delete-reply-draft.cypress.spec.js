import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientReplyPage from './pages/PatientReplyPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';
import singleThreadResponse from './fixtures/thread-response-new-api.json';

describe('SM DELETE REPLY DRAFT', () => {
  const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
    singleThreadResponse,
  );
  const singleMessage = { data: updatedSingleThreadResponse.data[0] };
  it('verify user can delete draft on reply', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    PatientReplyPage.loadReplyMessage(updatedSingleThreadResponse);

    PatientReplyPage.getMessageBodyField().click({ force: true });

    PatientReplyPage.getMessageBodyField()
      .clear({ force: true })
      .type(`Test Body`, {
        force: true,
      });

    PatientReplyPage.clickSaveReplyDraftButton(singleMessage, `Test Body`);

    PatientMessageDraftsPage.clickMultipleDeleteButton();
    PatientMessageDraftsPage.confirmDeleteDraft(singleMessage);
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    PatientMessageDraftsPage.verifyDraftMessageBannerTextHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
