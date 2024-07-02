import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

describe('secure Messaging Draft Folder checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages();
  });

  it('Verify folder header', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientMessagesSentPage.verifyFolderHeaderText('Drafts');
    PatientMessagesSentPage.verifyResponseBodyLength();
  });

  it('checks for "End of conversations in this folder" text', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
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
  });

  it('verify breadcrumbs', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    FolderLoadPage.verifyBreadCrumbsLength(4);
    FolderLoadPage.verifyBreadCrumbText(0, 'VA.gov home');
    FolderLoadPage.verifyBreadCrumbText(1, 'My HealtheVet');
    FolderLoadPage.verifyBreadCrumbText(2, 'Messages');
    FolderLoadPage.verifyBreadCrumbText(3, 'Drafts');
  });
});
