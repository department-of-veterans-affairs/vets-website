import mockPilotMessages from '../fixtures/pilot-responses/inbox-threads-OH-response.json';
import mockFolders from '../fixtures/pilot-responses/folders-respose.json';
import { Paths, Locators } from '../utils/constants';
import mockMultiThreadResponse from '../fixtures/pilot-responses/multi-message-thread-response.json';

class PilotEnvPage {
  loadInboxMessages = (
    url = Paths.UI_PILOT,
    messages = mockPilotMessages,
    folders = mockFolders,
  ) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE +
        Paths.FOLDERS}?page=1&per_page=999&useCache=false&requires_oh_messages=1`,
      folders,
    ).as('inboxPilotFolderMetaData');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('pilotFolders');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      messages,
    ).as('inboxPilotMessages');

    cy.visit(url + Paths.INBOX, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadThread = (mockThreadResponse = mockMultiThreadResponse) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        mockPilotMessages.data[0].attributes.messageId
      }/thread?full_body=true&requires_oh_messages=1`,
      mockThreadResponse,
    ).as('single-thread');

    cy.contains(mockPilotMessages.data[0].attributes.subject).click({
      waitForAnimations: true,
    });

    // cy.wait('@single-thread', { requestTimeout: 20000 });
  };

  verifyHeader = text => {
    cy.get(Locators.HEADER).should('contain.text', text);
  };

  verifyMessageDetails = (mockThreadResponse, index = 0) => {
    cy.get(Locators.FROM).should(
      `contain`,
      mockThreadResponse.data[index].attributes.senderName,
    );
    cy.get(Locators.TO).should(
      `contain`,
      mockThreadResponse.data[index].attributes.recipientName,
    );
    cy.get(Locators.MSG_ID).should(
      `contain`,
      mockThreadResponse.data[index].attributes.messageId,
    );
  };

  verifyUrl = url => {
    cy.url().should('contain', url);
  };

  verifyButtons = () => {
    cy.get(Locators.BUTTONS.REPLY)
      .should('be.visible')
      .and(`contain`, `Reply`);
    cy.get(Locators.BUTTONS.PRINT)
      .should('be.visible')
      .and(`contain`, `Print`);
    cy.get(`#move-button`)
      .should('be.visible')
      .and(`contain`, `Move`);
    cy.get(`#trash-button`)
      .should('be.visible')
      .and(`contain`, `Trash`);
  };

  verifyThreadLength = thread => {
    cy.get('[data-testid="thread-list-item"]').then(el => {
      expect(el.length).to.eq(thread.data.length);
    });
  };

  inputFilterData = text => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .type(text, { force: true });
  };

  clickFilterButton = mockFilterResponse => {
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/search*`,
      mockFilterResponse,
    ).as('filterResult');
    cy.get(Locators.BUTTONS.FILTER).click({ force: true });
    cy.wait('@filterResult');
  };

  verifyFilterResults = (filterValue, responseData) => {
    cy.get('[data-testid="message-list-item"]').then(el => {
      expect(el.length).to.eq(responseData.data.length);
    });
    cy.get(Locators.ALERTS.HIGHLIGHTED).each(element => {
      cy.wrap(element)
        .invoke('text')
        .then(text => {
          expect(text).to.contain(filterValue);
        });
    });
  };

  clickSortMessagesByDateButton = (
    option = 'Oldest to newest',
    sortedResponse,
  ) => {
    cy.get(Locators.DROPDOWN.SORT)
      .shadow()
      .find('select')
      .select(`${option}`, { force: true });
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0/threads**`,
      sortedResponse,
    );
    cy.get(Locators.BUTTONS.SORT).click({ force: true });
  };

  verifySorting = (option, data) => {
    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        this.clickSortMessagesByDateButton(option, data);
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
}

export default new PilotEnvPage();
