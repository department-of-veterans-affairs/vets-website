import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';
import { Alerts } from '../../../util/constants';

describe('verify delete functionality of multiple drafts in one thread', () => {
  const updatedMultiDraftResponse = GeneralFunctionsPage.updatedThreadDates(
    mockMultiDraftsResponse,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadMultiDraftThread(updatedMultiDraftResponse);
  });

  it('verify user can delete recent draft', () => {
    const reducedMultiDraftResponse = Cypress._.cloneDeep(
      updatedMultiDraftResponse,
    );
    reducedMultiDraftResponse.data.splice(0, 1);

    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.deleteMultipleDraft(
      updatedMultiDraftResponse,
      reducedMultiDraftResponse,
    );
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify user can delete previous draft', () => {
    const reducedMultiDraftResponse = Cypress._.cloneDeep(
      updatedMultiDraftResponse,
    );
    reducedMultiDraftResponse.data.splice(1, 1);

    cy.get('[text="Edit draft 1"]').click();

    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.deleteMultipleDraft(
      updatedMultiDraftResponse,
      reducedMultiDraftResponse,
      1,
    );
    PatientMessageDraftsPage.verifyConfirmationMessage(
      Alerts.Message.DELETE_DRAFT_SUCCESS,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify user can delete all drafts', () => {
    const reducedMultiDraftResponse = Cypress._.cloneDeep(
      updatedMultiDraftResponse,
    );
    reducedMultiDraftResponse.data.splice(0, 1);

    const noDraftsResponse = Cypress._.cloneDeep(updatedMultiDraftResponse);
    noDraftsResponse.data.splice(0, 2);

    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.deleteMultipleDraft(
      updatedMultiDraftResponse,
      reducedMultiDraftResponse,
    );
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();

    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.deleteMultipleDraft(
      reducedMultiDraftResponse,
      noDraftsResponse,
    );
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();

    cy.get(Locators.BUTTONS.DELETE_DRAFT).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
