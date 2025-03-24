import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM DRAFT FOLDER FILTER-SORT', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadDraftMessages();
  });

  it('verify filter works correctly', () => {
    PatientMessageDraftsPage.inputFilterDataText('test');
    PatientMessageDraftsPage.clickFilterMessagesButton();
    PatientMessageDraftsPage.verifyFilterResults('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientMessageDraftsPage.inputFilterDataText('any');
    PatientMessageDraftsPage.clickFilterMessagesButton();
    PatientMessageDraftsPage.clickClearFilterButton();
    PatientMessageDraftsPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    PatientMessageDraftsPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('SM DRAFT FOLDER PLAIN TG NAME FILTERING', () => {
  const updatedThreadResponse = GeneralFunctionsPage.updateTGSuggestedName(
    mockDraftMessages,
    'TG | Type | Name',
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadDraftMessages(updatedThreadResponse);
  });

  it('verify filter works correctly', () => {
    PatientMessageDraftsPage.inputFilterDataText(
      updatedThreadResponse.data[0].attributes.subject,
    );
    PatientMessageDraftsPage.clickFilterMessagesButton(updatedThreadResponse);

    PatientMessageDraftsPage.verifyDraftToField(
      updatedThreadResponse.data[0].attributes.subject,
    );

    cy.injectAxeThenAxeCheck();
  });
});
