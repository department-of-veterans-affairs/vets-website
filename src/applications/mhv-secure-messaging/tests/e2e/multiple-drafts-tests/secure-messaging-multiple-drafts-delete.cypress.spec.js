import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('verify delete functionality of multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const draftPage = new PatientMessageDraftsPage();

  const updatedMultiDraftResponse = GeneralFunctionsPage.updatedThreadDates(
    mockMultiDraftsResponse,
  );

  beforeEach(() => {
    site.login();
    PatientInboxPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(updatedMultiDraftResponse);
  });

  it('verify user can delete second draft', () => {
    const reducedMultiDraftResponse = Cypress._.cloneDeep(
      updatedMultiDraftResponse,
    );
    reducedMultiDraftResponse.data.splice(0, 1);

    draftPage.clickDeleteButton();
    draftPage.deleteDraft(updatedMultiDraftResponse, reducedMultiDraftResponse);
    draftPage.verifyDeleteConfirmationMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
