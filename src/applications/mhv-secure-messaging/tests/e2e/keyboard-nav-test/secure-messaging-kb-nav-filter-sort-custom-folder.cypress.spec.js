import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import mockSingleThreadResponse from '../fixtures/customResponse/custom-single-thread-response.json';

describe('SM CUSTOM FOLDER FILTER & SORT KB NAVIGATION', () => {
  const filteredData = {
    data: mockSingleThreadResponse.data.filter(item =>
      item.attributes.subject.toLowerCase().includes('covid'),
    ),
  };

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientCustomFolderPage.loadMessages();
  });

  it('verify filter works correctly', () => {
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientCustomFolderPage.inputFilterDataByKeyboard('covid');
    PatientCustomFolderPage.submitFilterByKeyboard(filteredData);
    PatientCustomFolderPage.verifyFilterResults('covid', filteredData);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientCustomFolderPage.inputFilterDataByKeyboard('test');
    PatientCustomFolderPage.submitFilterByKeyboard(filteredData);
    PatientCustomFolderPage.clearFilterByKeyboard();
    PatientCustomFolderPage.verifyFilterFieldCleared();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const testData = {
      data: Array.from(mockSingleThreadResponse.data).sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientCustomFolderPage.verifySortingByKeyboard(
      'Oldest to newest',
      testData,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
