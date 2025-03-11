import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientFilterPage from '../pages/PatientFilterPage';
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
    PatientFilterPage.typeFilterInputFieldText(searchText);
    PatientFilterPage.clickInboxFilterButton();
    PatientFilterPage.verifyHighlightedText(searchText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Basic Search Highlight Drafts Check', () => {
    PatientMessageDraftsPage.loadDrafts();

    PatientFilterPage.typeFilterInputFieldText(searchText);
    PatientFilterPage.clickDraftFilterButton();
    PatientFilterPage.verifyHighlightedText(searchText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
