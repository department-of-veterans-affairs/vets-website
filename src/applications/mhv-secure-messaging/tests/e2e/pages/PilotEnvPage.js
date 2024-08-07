import mockPilotMessages from '../fixtures/pilot-responses/inbox-threads-OH-response.json';
import mockFolders from '../fixtures/pilot-responses/folders-respose.json';
import { Paths, Locators } from '../utils/constants';
import mockThread from '../fixtures/thread-response.json';
import mockSingleThread from '../fixtures/pilot-responses/single-message-thread-response.json';

class PilotEnvPage {
  loadInboxMessages = (
    url = Paths.UI_PILOT,
    messages = mockPilotMessages,
    folders = mockFolders,
  ) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE +
        Paths.FOLDERS}/0/threads?pageSize=10&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC&requires_oh_messages=1`,
      messages,
    ).as('inboxPilotMessages');

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
    ).as('folders');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      messages,
    ).as('inboxMessages');

    cy.visit(url + Paths.INBOX, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadSingleThread = (
    mockMessages = mockPilotMessages,
    testSingleThread = mockSingleThread,
    sentDate = new Date(),
    draftDate = mockThread.data[0].attributes.draftDate,
  ) => {
    this.singleThread = testSingleThread;
    this.singleThread.data[0].attributes.sentDate = sentDate;
    this.singleThread.data[0].attributes.draftDate = draftDate;

    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        mockMessages.data[0].attributes.messageId
      }/thread?full_body=true*`,
      this.singleThread,
    ).as('full-thread');

    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        this.singleThread.data[0].attributes.messageId
      }`,
      { data: this.singleThread.data[0] },
    ).as('fist-message-in-thread');

    cy.contains(mockMessages.data[0].attributes.subject).click({
      waitForAnimations: true,
    });
    cy.wait('@full-thread', { requestTimeout: 20000 });
  };

  verifyMessageDetails = (date, index = 0) => {
    cy.get(Locators.MSG_DATE).should(`contain`, date);
    cy.get(Locators.FROM).should(
      `contain`,
      mockSingleThread.data[index].attributes.senderName,
    );
    cy.get(Locators.TO).should(
      `contain`,
      mockSingleThread.data[index].attributes.recipientName,
    );
    cy.get(Locators.MSG_ID).should(
      `contain`,
      mockSingleThread.data[index].attributes.messageId,
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
}

export default new PilotEnvPage();
