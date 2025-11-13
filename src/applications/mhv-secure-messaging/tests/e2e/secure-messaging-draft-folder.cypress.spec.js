import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/draftsResponse/drafts-messages-response.json';
import SharedComponents from './pages/SharedComponents';

describe('SM DRAFT FOLDER VERIFICATION', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockDraftMessages);
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages();
  });

  it('Verify folder header', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    GeneralFunctionsPage.verifyPageHeader(`Messages: Drafts`);
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
    SharedComponents.backBreadcrumb().should('have.attr', 'text', 'Back');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
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

describe('TG PLAIN NAMES', () => {
  const updatedThreadResponse = GeneralFunctionsPage.updateTGSuggestedName(
    mockDraftMessages,
    'TG | Type | Name',
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(updatedThreadResponse);
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages(updatedThreadResponse);
  });

  it('verify TG plain name in thread', () => {
    cy.findAllByTestId('thread-list-item')
      .first()
      .should(
        'contain.text',
        updatedThreadResponse.data[0].attributes.suggestedNameDisplay,
      );

    cy.injectAxeThenAxeCheck();
  });
});
