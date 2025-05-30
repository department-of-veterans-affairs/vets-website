import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Data, Locators, Paths } from './utils/constants';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';
import FolderLoadPage from './pages/FolderLoadPage';
import mockMessages from './fixtures/threads-response.json';

describe('SM INBOX FOLDER VERIFICATION', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Verify folder header', () => {
    GeneralFunctionsPage.verifyPageHeader(`Messages: Inbox`);
    PatientMessagesSentPage.verifyResponseBodyLength();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('checks for "End of conversations in this folder" text', () => {
    cy.get('.endOfThreads').should('not.exist');
    cy.get('.usa-pagination__list li').then(pagesList => {
      const lastPageIndex = pagesList.length - 2;
      FolderLoadPage.clickAndNavigateToLastPage(lastPageIndex);
      cy.get('.endOfThreads').should(
        'have.text',
        Data.END_CONVERSATION_IN_FOLDER,
      );
    });
    FolderLoadPage.verifyPaginationElements();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify breadcrumbs', () => {
    FolderLoadPage.verifyBreadCrumbsLength(3);
    FolderLoadPage.verifyBreadCrumbText(0, 'VA.gov home');
    FolderLoadPage.verifyBreadCrumbText(1, 'My HealtheVet');
    FolderLoadPage.verifyBreadCrumbText(2, 'Messages: Inbox');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

describe('THREAD LIST RE-FETCHING VERIFICATION', () => {
  it('verify data updates after each rendering', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0/threads**`,
      mockMessages,
    ).as('reFetchResponse');

    PatientInboxPage.loadSingleThread();
    cy.get(Locators.LINKS.CRUMBS_BACK).click();
    cy.wait('@reFetchResponse').then(interception => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get(`@reFetchResponse.all`).should(`have.length.at.least`, 1);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
