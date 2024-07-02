import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageTrashPage from './pages/PatientMessageTrashPage';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('Secure Messaging Trash Folder checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDeletedMessages();
  });

  it('Verify folder header', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientMessageTrashPage.verifyFolderHeaderText('Trash');
    PatientMessageTrashPage.verifyResponseBodyLength();
  });

  it('Checks for "End of conversations in this folder" text', () => {
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
    FolderLoadPage.verifyBreadCrumbText(3, 'Trash');
  });
});
