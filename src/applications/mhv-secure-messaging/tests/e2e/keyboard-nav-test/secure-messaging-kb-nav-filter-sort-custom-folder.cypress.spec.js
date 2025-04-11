import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import PatientFilterPage from '../pages/PatientFilterPage';
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
    cy.log(JSON.stringify(filteredData));
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientFilterPage.inputFilterDataByKeyboard('covid');
    PatientFilterPage.submitFilterByKeyboard(filteredData);
    PatientFilterPage.verifyFilterResults('covid', filteredData);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterDataByKeyboard('test');
    PatientFilterPage.submitFilterByKeyboard(filteredData);
    PatientFilterPage.clearFilterByKeyboard();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const sortedResult = PatientFilterPage.sortMessagesThread(
      mockSingleThreadResponse,
    );

    PatientFilterPage.verifySortingByKeyboard(sortedResult);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
