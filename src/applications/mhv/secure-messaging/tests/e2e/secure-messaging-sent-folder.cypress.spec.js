import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';

describe('Secure Messaging Sent Folder checks', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
  });
  it('Axe Check Sent Folder', () => {
    PatientMessagesSentPage.loadMessages();
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
    PatientMessagesSentPage.loadMessages();
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
    PatientMessagesSentPage.loadMessages();
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
    PatientMessagesSentPage.loadMessages();
    PatientMessagesSentPage.inputFilterData('any');
    PatientMessagesSentPage.filterMessages();
    PatientMessagesSentPage.clearFilter();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientMessagesSentPage.verifyFilterFieldCleared();
  });
});
