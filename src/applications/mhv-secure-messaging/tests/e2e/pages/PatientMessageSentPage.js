import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import mockSentFolderMetaResponse from '../fixtures/sentResponse/folder-sent-metadata.json';
import mockThreadResponse from '../fixtures/sentResponse/sent-thread-response.json';
import mockSingleMessageResponse from '../fixtures/sentResponse/sent-single-message-response.json';
import { Locators, Paths } from '../utils/constants';

class PatientMessageSentPage {
  loadMessages = (mockMessagesResponse = mockSentMessages) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1*`,
      mockSentFolderMetaResponse,
    ).as('sentFolder');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1/threads**`,
      mockMessagesResponse,
    ).as('sentFolderMessages');
    cy.get('[data-testid="sent-inner-nav"]>a').click({ force: true });
  };

  loadSingleThread = (
    singleThreadResponse = mockThreadResponse,
    multiThreadsResponse = mockSentMessages,
  ) => {
    const singleMessageResponse = { data: singleThreadResponse.data[0] };
    cy.intercept(
      `GET`,
      `${Paths.SM_API_EXTENDED}/${
        multiThreadsResponse.data[0].attributes.messageId
      }/thread*`,
      singleThreadResponse,
    ).as(`threadResponse`);

    cy.intercept(
      `GET`,
      `${Paths.SM_API_EXTENDED}/${
        singleThreadResponse.data[0].attributes.messageId
      }`,
      singleMessageResponse,
    ).as(`threadFirstMessageResponse`);
    cy.get(
      `#message-link-${multiThreadsResponse.data[0].attributes.messageId}`,
    ).click();
  };

  loadDetailedMessage = (detailedMessage = mockSingleMessageResponse) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        detailedMessage.data.attributes.messageId
      }/thread`,
      mockThreadResponse,
    ).as('threadResponse');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        detailedMessage.data.attributes.messageId
      }`,
      mockSingleMessageResponse,
    ).as('detailedMessage');

    cy.get(Locators.THREADS)
      .first()
      .click();
  };

  verifyResponseBodyLength = (responseData = mockSentMessages) => {
    cy.get(Locators.THREADS).should(
      'have.length',
      `${responseData.data.length}`,
    );
  };

  sortMessagesByKeyboard = (text, data, folderId) => {
    cy.get(Locators.DROPDOWN.SORT)
      .shadow()
      .find('select')
      .select(`${text}`, { force: true });

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderId}/threads**`,
      data,
    ).as('sortResponse');
    cy.tabToElement('[data-testid="sort-button"]');
    cy.realPress('Enter');
  };

  verifySortingByKeyboard = (text, data, folderId) => {
    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        this.sortMessagesByKeyboard(`${text}`, data, folderId);
        cy.get(Locators.THREAD_LIST)
          .find(Locators.DATE_RECEIVED)
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(`List after sorting${JSON.stringify(listAfter)}`);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  verifySentToFieldContainsPalinTGName = value => {
    cy.get('[data-testid="message-list-item"]').should('contain.text', value);
  };
}

export default new PatientMessageSentPage();
