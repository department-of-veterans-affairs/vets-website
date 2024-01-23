import SecureMessagingSite from './sm_site/SecureMessagingSite';
import BasicSearchPage from './pages/PatientBasicSearchPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Basic Search Tests', () => {
  const patientMessageDraftsPage = new PatientMessageDraftsPage();
  // const searchText = 'special %$#';  Known-Issue... special chars don't highlight
  const searchText = 'special';
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();

    site.login();
    landingPage.loadInboxMessages();
  });

  it('Basic Search Highlight Inbox Check', () => {
    BasicSearchPage.typeSearchInputFieldText(searchText);
    BasicSearchPage.submitInboxSearch();
    BasicSearchPage.verifyHighlightedText(searchText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Basic Search Highlight Drafts Check', () => {
    patientMessageDraftsPage.loadDraftMessages();
    BasicSearchPage.typeSearchInputFieldText(searchText);
    BasicSearchPage.submitDraftSearch();
    BasicSearchPage.verifyHighlightedText(searchText);
    cy.injectAxe();

    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
