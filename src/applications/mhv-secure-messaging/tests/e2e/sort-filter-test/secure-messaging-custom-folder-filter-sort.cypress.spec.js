import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import customSearchResponse from '../fixtures/customResponse/custom-search-response.json';
import mockSingleThreadResponse from '../fixtures/customResponse/custom-single-thread-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('SM CUSTOM FOLDER FILTER-SORT CHECKS', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
  });

  it('verify filter works correctly', () => {
    PatientFilterPage.inputFilterData('test');
    PatientFilterPage.clickApplyFilterButton(customSearchResponse);
    PatientFilterPage.verifyFilterResults('test', customSearchResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterData('any');
    PatientFilterPage.clickApplyFilterButton(customSearchResponse);
    PatientFilterPage.clickClearFilterButton();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('check sorting works properly', () => {
    const sortedResponse = PatientFilterPage.sortMessagesThread(
      mockSingleThreadResponse,
    );

    PatientFilterPage.verifySorting(sortedResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
