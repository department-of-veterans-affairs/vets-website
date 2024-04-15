import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessagesDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging Draft Folder checks', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const draftsPage = new PatientMessagesDraftsPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftsPage.loadMessages();
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
    draftsPage.inputFilterDataText('test');
    draftsPage.clickFilterMessagesButton();
    draftsPage.verifyFilterResultsText('test');
  });

  it('Verify filter works with Date', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    draftsPage.inputFilterDataText('Last 3 Months');
    draftsPage.clickFilterMessagesButton();
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
    draftsPage.inputFilterDataText('any');
    draftsPage.clickFilterMessagesButton();
    draftsPage.clickClearFilterButton();
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
