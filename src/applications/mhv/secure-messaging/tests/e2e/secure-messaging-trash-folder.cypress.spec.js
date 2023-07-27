import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageTrashPage from './pages/PatientMessageTrashPage';

describe('Secure Messaging Trash Folder checks', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageTrashPage.loadMessages();
  });
  it('Axe Check Trash Folder', () => {
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
    PatientMessageTrashPage.verifyFolderHeader('Trash');
    PatientMessageTrashPage.verifyResponseBodyLength();
  });

  it('Verify filter works correctly', () => {
    PatientMessageTrashPage.inputFilterData('test');
    PatientMessageTrashPage.filterMessages();
    PatientMessageTrashPage.verifyFilterResults('test');
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
    PatientMessageTrashPage.inputFilterData('any');
    PatientMessageTrashPage.filterMessages();
    PatientMessageTrashPage.clearFilter();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientMessageTrashPage.verifyFilterFieldCleared();
  });

  it('Check sorting works properly', () => {
    PatientMessageTrashPage.listBeforeSort();
    PatientMessageTrashPage.listAfterSort();
    PatientMessageTrashPage.verifySortedList();

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
