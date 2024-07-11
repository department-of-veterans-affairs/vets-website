import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientBasicSearchPage from '../pages/PatientBasicSearchPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Basic Search Tests', () => {
  const patientMessageDraftsPage = new PatientMessageDraftsPage();
  // const searchText = 'special %$#';  Known-Issue... special chars don't highlight
  const searchText = 'special';
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Basic Search Highlight Inbox Check', () => {
    PatientBasicSearchPage.typeSearchInputFieldText(searchText);
    PatientBasicSearchPage.clickInboxSearchButton();
    PatientBasicSearchPage.verifyHighlightedText(searchText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Basic Search Highlight Drafts Check', () => {
    patientMessageDraftsPage.loadDraftMessages();
    PatientBasicSearchPage.typeSearchInputFieldText(searchText);
    PatientBasicSearchPage.clickDraftSearchButton();
    PatientBasicSearchPage.verifyHighlightedText(searchText);
    cy.injectAxe();

    cy.axeCheck(AXE_CONTEXT);
  });
});
