import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessagesDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';

describe('Secure Messaging Draft Folder checks', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const draftsPage = new PatientMessagesDraftsPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftsPage.loadMessages();
  });

  it.skip('Verify filter works correctly', () => {
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

  it.skip('Verify filter works with Date', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    draftsPage.inputFilterData('Last 3 Months');
    draftsPage.filterMessages();
  });
  it.skip('Verify clear filter btn works correctly', () => {
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
