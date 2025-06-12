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

  verifySentToFieldContainsPalinTGName = value => {
    cy.get('[data-testid="message-list-item"]').should('contain.text', value);
  };

  verifyReadReceipt = text => {
    cy.get('[data-testid^="expand-message-button-"]')
      .not('[data-testid*="for-print"]')
      .each(el => {
        cy.wrap(el)
          .should(`be.visible`)
          .and(`contain.text`, text);
      });
  };
}

export default new PatientMessageSentPage();
