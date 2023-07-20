// import mockSentMessages from './fixtures/sentResponse/sent-messages-response.json';
import mockSortedMessages from './fixtures/sentResponse/sorted-sent-messages-response.json';
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
  it.skip('Axe Check Sent Folder', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it.skip('Verify folder header', () => {
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

  it.skip('Verify filter works correctly', () => {
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

  it.skip('Verify clear filter btn works correctly', () => {
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

  it('Check sorting works properly', () => {
    let listBeforeSort;
    cy.get('.thread-list-item')
      .find('.received-date')
      .then(list => {
        listBeforeSort = Cypress._.map(list, el => el.innerText);
        cy.log(cy.wrap(listBeforeSort));
      });
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('#select')
      .select('Oldest to newest');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/threads**',
      mockSortedMessages,
    );
    cy.get('[data-testid="sort-button"]').click({ force: true });
    let listAfterSort;
    cy.get('.thread-list-item')
      .find('.received-date')
      .then(list => {
        listAfterSort = Cypress._.map(list, el => el.innerText);
        cy.log(cy.wrap(listAfterSort));
      });
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
