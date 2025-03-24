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
    PatientInboxPage.loadInboxMessages(mockDraftMessages);
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

  const filteredResponse = {
    data: updatedThreadResponse.data.filter(
      item => item.attributes.suggestedNameDisplay === 'TG | Type | Name',
    ),
  };
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages(updatedThreadResponse);
  });

  it('verify filter works correctly', () => {
    PatientMessageDraftsPage.inputFilterDataText('TG');
    PatientMessageDraftsPage.clickFilterMessagesButton(filteredResponse);

    PatientMessageDraftsPage.verifyDraftToField('TG');

    cy.injectAxeThenAxeCheck();
  });
});
