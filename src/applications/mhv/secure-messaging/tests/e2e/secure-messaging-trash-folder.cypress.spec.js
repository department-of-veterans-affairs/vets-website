import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageTrashPage from './pages/PatientMessageTrashPage';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Trash Folder checks', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageTrashPage.loadMessages();
  });

  it('Verify folder header', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageTrashPage.verifyFolderHeader('Trash');
    PatientMessageTrashPage.verifyResponseBodyLength();
  });

  it('Verify filter works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageTrashPage.inputFilterData('test');
    PatientMessageTrashPage.filterMessages();
    PatientMessageTrashPage.verifyFilterResults('test');
  });

  it('Verify clear filter btn works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageTrashPage.inputFilterData('any');
    PatientMessageTrashPage.filterMessages();
    PatientMessageTrashPage.clearFilter();
    PatientMessageTrashPage.verifyFilterFieldCleared();
  });

  it('Check sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageTrashPage.verifySorting();
  });

  it('Checks for "End of conversations in this folder" text', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('.endOfThreads').should('not.exist');
    cy.get('.usa-pagination__list li').then(pagesList => {
      const lastPageIndex = pagesList.length - 2;
      FolderLoadPage.navigateToLastPage(lastPageIndex);
      cy.get('.endOfThreads').should(
        'have.text',
        'End of conversations in this folder',
      );
    });
    FolderLoadPage.verifyPaginationElements();
  });
});
