import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';

describe('Secure Messaging Sent Folder checks', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessagesSentPage.loadMessages();
  });
  it('Axe Check Sent Folder', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Verify folder header', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientMessagesSentPage.verifyFolderHeader('Sent messages');
    PatientMessagesSentPage.verifyResponseBodyLength();
  });

  it('Verify filter works correctly', () => {
    PatientMessagesSentPage.inputFilterData('test');
    PatientMessagesSentPage.filterMessages();
    PatientMessagesSentPage.verifyFilterResults('test');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Verify clear filter btn works correctly', () => {
    PatientMessagesSentPage.inputFilterData('any');
    PatientMessagesSentPage.filterMessages();
    PatientMessagesSentPage.clearFilter();
    PatientMessagesSentPage.verifyFilterFieldCleared();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Check sorting works properly', () => {
    PatientMessagesSentPage.listBeforeSort();
    PatientMessagesSentPage.listAfterSort();
    PatientMessagesSentPage.verifySortedList();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
