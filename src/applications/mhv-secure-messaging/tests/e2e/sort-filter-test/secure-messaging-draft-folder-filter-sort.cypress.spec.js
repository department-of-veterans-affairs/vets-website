import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import draftSearchResponse from '../fixtures/draftsResponse/drafts-search-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM DRAFT FOLDER FILTER-SORT', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadDraftMessages();
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(draftSearchResponse);
    PatientFilterPage.verifyFilterResults('test', draftSearchResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton();
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    PatientMessageDraftsPage.verifySorting();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
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
    PatientFilterPage.inputFilterData(
      updatedThreadResponse.data[0].attributes.subject,
    );
    PatientFilterPage.clickApplyFilterButton(updatedThreadResponse);

    PatientMessageDraftsPage.verifyDraftToFieldContainsPlainTGName(
      updatedThreadResponse.data[0].attributes.subject,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
