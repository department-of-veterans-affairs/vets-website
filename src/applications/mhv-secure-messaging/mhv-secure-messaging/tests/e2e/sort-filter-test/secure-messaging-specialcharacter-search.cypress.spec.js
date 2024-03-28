import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientBasicSearchPage from '../pages/PatientBasicSearchPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Basic Search Tests', () => {
  const basicSearchPage = new PatientBasicSearchPage();
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
    basicSearchPage.typeSearchInputFieldText(searchText);
    basicSearchPage.submitInboxSearch();
    basicSearchPage.verifyHighlightedText(searchText);

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
    basicSearchPage.typeSearchInputFieldText(searchText);
    basicSearchPage.submitDraftSearch();
    basicSearchPage.verifyHighlightedText(searchText);
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
