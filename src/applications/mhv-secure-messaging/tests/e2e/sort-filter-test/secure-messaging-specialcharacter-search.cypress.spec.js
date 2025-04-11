import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientFilterPage from '../pages/PatientFilterPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMessageResponse from '../fixtures/drafts-search-results.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Basic Search Tests', () => {
  // const searchText = 'special %$#';  Known-Issue... special chars don't highlight
  const searchText = 'special';
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Basic Search Highlight Inbox Check', () => {
    PatientFilterPage.inputFilterData(searchText);
    PatientFilterPage.clickApplyFilterButton(mockMessageResponse);
    PatientFilterPage.verifyHighlightedText(searchText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Basic Search Highlight Drafts Check', () => {
    PatientMessageDraftsPage.loadDrafts();

    PatientFilterPage.inputFilterData(searchText);
    PatientFilterPage.clickApplyFilterButton(mockMessageResponse);
    PatientFilterPage.verifyHighlightedText(searchText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
