import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import mockSentFolderMetaResponse from '../fixtures/sentResponse/folder-sent-metadata.json';
import mockThreadResponse from '../fixtures/sentResponse/sent-thread-response.json';
import mockSingleMessageResponse from '../fixtures/sentResponse/sent-single-message-response.json';
import sentSearchResponse from '../fixtures/sentResponse/sent-search-response.json';
import mockSortedMessages from '../fixtures/sentResponse/sorted-sent-messages-response.json';

class PatientMessageSentPage {
  loadMessages = (mockMessagesResponse = mockSentMessages) => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1*',
      mockSentFolderMetaResponse,
    ).as('sentFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/threads**',
      mockMessagesResponse,
    ).as('sentFolderMessages');
    cy.get('[data-testid="sent-sidebar"]').click();
    cy.wait('@sentFolder');
    cy.wait('@sentFolderMessages');
  };

  loadDetailedMessage = (detailedMessage = mockSingleMessageResponse) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        detailedMessage.data.attributes.messageId
      }/thread`,
      mockThreadResponse,
    ).as('threadResponse');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        detailedMessage.data.attributes.messageId
      }`,
      mockSingleMessageResponse,
    ).as('detailedMessage');

    cy.get('[data-testid="thread-list-item"]')
      .first()
      .click();
  };

  inputFilterData = text => {
    cy.get('#filter-input')
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  filterMessages = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search',
      sentSearchResponse,
    );
    cy.get('[data-testid="filter-messages-button"]').click({ force: true });
  };

  clearFilter = () => {
    this.inputFilterData('any');
    this.filterMessages();
    cy.get('[text="Clear Filters"]').click({ force: true });
  };

  sortMessagesByDate = (text, sortedResponse = mockSortedMessages) => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('#select')
      .select(`${text}`, { force: true });
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/threads**',
      sortedResponse,
    );
    cy.get('[data-testid="sort-button"]').click({ force: true });
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get('.thread-list-item')
      .find('[data-testid="received-date"]')
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(JSON.stringify(listBefore));
      })
      .then(() => {
        this.sortMessagesByDate('Oldest to newest');
        cy.get('.thread-list-item')
          .find('[data-testid="received-date"]')
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(JSON.stringify(listAfter));
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  verifyFolderHeader = text => {
    cy.get('[data-testid="folder-header"]').should('have.text', `${text}`);
  };

  verifyResponseBodyLength = (responseData = mockSentMessages) => {
    cy.get('[data-testid="thread-list-item"]').should(
      'have.length',
      `${responseData.data.length}`,
    );
  };

  verifyFilterResults = (filterValue, responseData = sentSearchResponse) => {
    cy.get('[data-testid="message-list-item"]').should(
      'have.length',
      `${responseData.data.length}`,
    );

    cy.get('[data-testid="highlighted-text"]').each(element => {
      cy.wrap(element)
        .invoke('text')
        .then(text => {
          const lowerCaseText = text.toLowerCase();
          expect(lowerCaseText).to.contain(`${filterValue}`);
        });
    });
  };

  verifyFilterFieldCleared = () => {
    cy.get('#filter-input')
      .shadow()
      .find('#inputField')
      .should('be.empty');
  };
}

export default new PatientMessageSentPage();
