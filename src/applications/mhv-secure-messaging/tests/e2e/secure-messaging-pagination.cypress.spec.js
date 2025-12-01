import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessagesPageOne from './fixtures/threads-response.json';
import mockMessagesPageTwo from './fixtures/messages-response-page-2.json';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';
import PatientFilterPage from './pages/PatientFilterPage';

describe('Secure Messaging Reply', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
  });
  it('Axe Pagination Test', () => {
    const threadLength = 28;

    mockMessagesPageOne.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    mockMessagesPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });

    PatientInboxPage.loadInboxMessages(mockMessagesPageOne);
    cy.get('va-pagination').should('be.visible');
    SecureMessagingSite.clickAndLoadVAPaginationNextMessagesButton(
      2,
      mockMessagesPageTwo,
    );
    SecureMessagingSite.verifyPaginationMessagesDisplayedText(
      11,
      20,
      threadLength,
    );
    FolderLoadPage.verifyPaginationElements();
    SecureMessagingSite.clickAndLoadVAPaginationPreviousMessagesButton(
      1,
      mockMessagesPageOne,
    );
    SecureMessagingSite.verifyPaginationMessagesDisplayedText(
      1,
      10,
      threadLength,
    );
    FolderLoadPage.verifyPaginationElements();

    SecureMessagingSite.clickAndLoadVAPaginationPageMessagesLink(
      2,
      mockMessagesPageTwo,
    );
    SecureMessagingSite.verifyPaginationMessagesDisplayedText(
      11,
      20,
      threadLength,
    );
    SecureMessagingSite.clickAndLoadVAPaginationPageMessagesLink(
      1,
      mockMessagesPageOne,
    );
    SecureMessagingSite.verifyPaginationMessagesDisplayedText(
      1,
      10,
      threadLength,
    );

    cy.get('.usa-pagination__list li').then(pagesList => {
      const lastPageIndex = pagesList.length - 2;
      FolderLoadPage.clickAndNavigateToLastPage(lastPageIndex);
      cy.get('.endOfThreads').should(
        'have.text',
        Data.END_CONVERSATION_IN_FOLDER,
      );
    });
    FolderLoadPage.verifyPaginationElements();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('verify pagination for one message on last page', () => {
    const threadLength = 21;
    const pageNumber = Math.ceil(threadLength / 10);

    mockMessagesPageOne.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });

    const mockSingleMessageThread = {
      data: [mockMessagesPageOne.data[mockMessagesPageOne.data.length - 1]],
    };

    PatientInboxPage.loadInboxMessages(mockMessagesPageOne);
    SecureMessagingSite.clickAndLoadVAPaginationLastPageButton(
      pageNumber,
      mockSingleMessageThread,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('.thread-list').should('have.length', 1);

    cy.get('.endOfThreads').should(
      'have.text',
      Data.END_CONVERSATION_IN_FOLDER,
    );
    cy.get('.usa-pagination__item').each(el => {
      cy.get(el).should('be.visible');
    });
  });

  it('verify correct number of messages rendered after filtering reduces page count', () => {
    const initialThreadLength = 28;
    const filteredThreadLength = 5;

    mockMessagesPageOne.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = initialThreadLength;
    });
    mockMessagesPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = initialThreadLength;
    });

    PatientInboxPage.loadInboxMessages(mockMessagesPageOne);
    cy.get('va-pagination').should('be.visible');

    SecureMessagingSite.clickAndLoadVAPaginationNextMessagesButton(
      2,
      mockMessagesPageTwo,
    );
    SecureMessagingSite.verifyPaginationMessagesDisplayedText(
      11,
      20,
      initialThreadLength,
    );

    const filterResultResponse = PatientFilterPage.createCategoryFilterMockResponse(
      filteredThreadLength,
      'Appointment',
      mockMessagesPageOne,
    );

    PatientFilterPage.openAdditionalFilter();
    PatientFilterPage.selectAdvancedSearchCategory('Appointment');
    PatientFilterPage.clickApplyFilterButton(filterResultResponse);

    cy.get('va-pagination').should('not.exist');
    PatientFilterPage.verifyFilterResponseLength(filterResultResponse);

    cy.findByText(content => {
      return content.includes(
        `Showing 1 to ${filteredThreadLength} of ${filteredThreadLength}`,
      );
    });
    cy.findByText('End of search results');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
