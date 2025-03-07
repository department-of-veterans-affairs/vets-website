import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientSearchPage from '../pages/PatientSearchPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Basic Search Tests', () => {
  // const searchText = 'special %$#';  Known-Issue... special chars don't highlight
  const searchText = 'special';
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Basic Search Highlight Inbox Check', () => {
    PatientSearchPage.typeSearchInputFieldText(searchText);
    PatientSearchPage.clickInboxSearchButton();
    PatientSearchPage.verifyHighlightedText(searchText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Basic Search Highlight Drafts Check', () => {
    PatientMessageDraftsPage.loadDrafts();

    PatientSearchPage.typeSearchInputFieldText(searchText);
    PatientSearchPage.clickDraftSearchButton();
    PatientSearchPage.verifyHighlightedText(searchText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
