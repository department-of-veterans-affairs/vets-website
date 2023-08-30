import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessagesDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';

describe('Secure Messaging Draft Folder checks', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const draftsPage = new PatientMessagesDraftsPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    PatientMessagesSentPage.loadMessages();
  });
  it('Axe Check Draft Folder', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  it('Verify filter works correctly', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    draftsPage.inputFilterData('test');
    draftsPage.filterMessages();
    draftsPage.verifyFilterResults('test');
  });

  it('Verify clear filter btn works correctly', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    draftsPage.inputFilterData('any');
    draftsPage.filterMessages();
    draftsPage.clearFilter();
    draftsPage.verifyFilterFieldCleared();
  });

  it('Check sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    draftsPage.verifySorting();
  });
});
