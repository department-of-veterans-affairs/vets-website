import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Data } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('re-save multiple drafts in one thread', () => {
  const updatedMultiDraftResponse = GeneralFunctionsPage.updatedThreadDates(
    mockMultiDraftsResponse,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadMultiDraftThread(updatedMultiDraftResponse);
  });

  it('verify first draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get('textarea').type('newText', { force: true });
    PatientMessageDraftsPage.saveMultiDraftMessage(
      updatedMultiDraftResponse.data[0],
      updatedMultiDraftResponse.data[0].attributes.messageId,
    );

    PatientMessageDraftsPage.verifySavedMessageAlertText(
      Data.MESSAGE_WAS_SAVED,
    );
  });

  it('verify second draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get('#edit-draft-button').click({ waitForAnimations: true });
    cy.get('textarea').type('newText', { force: true });
    PatientMessageDraftsPage.saveMultiDraftMessage(
      updatedMultiDraftResponse.data[1],
      updatedMultiDraftResponse.data[1].attributes.messageId,
    );

    PatientMessageDraftsPage.verifySavedMessageAlertText(
      Data.MESSAGE_WAS_SAVED,
    );
    PatientInboxPage.verifyNotForPrintHeaderText();
  });
});
