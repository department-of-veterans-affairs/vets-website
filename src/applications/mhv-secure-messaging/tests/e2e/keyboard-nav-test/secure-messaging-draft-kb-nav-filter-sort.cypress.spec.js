import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import FolderLoadPage from '../pages/FolderLoadPage';

describe('Draft page keyboard navigation for filter & sort features', () => {
  const draftPage = new PatientMessageDraftsPage();
  const filteredData = {
    data: inboxFilterResponse.data.filter(item =>
      item.attributes.subject.toLowerCase().includes('test'),
    ),
  };

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockDraftMessages);
    FolderLoadPage.loadDraftMessages(mockDraftMessages);
  });

  it('verify filter works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    draftPage.inputFilterDataByKeyboard('test');
    draftPage.submitFilterByKeyboard(filteredData, -2);
    draftPage.verifyFilterResults('test', filteredData);
  });

  it('verify clear filter btn works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    draftPage.inputFilterDataByKeyboard('test');
    draftPage.submitFilterByKeyboard(filteredData, -2);
    draftPage.clearFilterByKeyboard();
    draftPage.verifyFilterFieldCleared();
  });

  it('verify sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    const testData = {
      data: Array.from(mockDraftMessages.data).sort(
        (a, b) =>
          new Date(a.attributes.draftDate) - new Date(b.attributes.draftDate),
      ),
    };

    draftPage.verifySortingByKeyboard('Oldest to newest', testData, -2);
  });
});
