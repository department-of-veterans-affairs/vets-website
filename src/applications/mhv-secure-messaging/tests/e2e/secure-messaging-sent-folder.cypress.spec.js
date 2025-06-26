import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageSentPage from './pages/PatientMessageSentPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import mockSentMessages from './fixtures/sentResponse/sent-messages-response.json';

describe('secure Messaging Sent Folder checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockSentMessages);
    FolderLoadPage.loadFolders();
    PatientMessageSentPage.loadMessages();
  });

  it('Verify folder header', () => {
    GeneralFunctionsPage.verifyPageHeader(`Messages: Sent`);
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientMessageSentPage.verifyResponseBodyLength();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
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

    FolderLoadPage.verifyBreadCrumbsLength(3);
    FolderLoadPage.verifyBreadCrumbText(0, 'VA.gov home');
    FolderLoadPage.verifyBreadCrumbText(1, 'My HealtheVet');
    FolderLoadPage.verifyBreadCrumbText(2, 'Messages: Sent');
  });
});

describe('TG PLAIN NAMES', () => {
  const updatedThreadResponse = GeneralFunctionsPage.updateTGSuggestedName(
    mockSentMessages,
    'TG | Type | Name',
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(updatedThreadResponse);
    FolderLoadPage.loadFolders();
    PatientMessageSentPage.loadMessages(updatedThreadResponse);
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
