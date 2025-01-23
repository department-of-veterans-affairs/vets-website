import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/draftsResponse/drafts-messages-response.json';

describe('SM DRAFT FOLDER VERIFICATION', () => {
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

  it('verify subheaders', () => {
    cy.get(Locators.DROPDOWN.SORT)
      .shadow()
      .find(`label`)
      .should(`have.text`, `Show drafts in this order`);

    cy.get(Locators.SUBHEADERS.NUMBER_OF_THREADS).should(
      `include.text`,
      `drafts`,
    );

    PatientMessageDraftsPage.verifyThreadRecipientName(mockDraftMessages, 0);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
