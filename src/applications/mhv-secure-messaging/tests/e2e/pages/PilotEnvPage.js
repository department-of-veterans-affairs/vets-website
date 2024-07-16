import mockPilotMessages from '../fixtures/pilot-responses/inbox-threads-OH-response.json';
import mockFolders from '../fixtures/pilot-responses/folders-respose.json';
import { Paths } from '../utils/constants';

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

  verifyUrl = url => {
    cy.url().should('contain', url);
  };

  verifyThreadLength = thread => {
    cy.get('[data-testid="thread-list-item"]').then(el => {
      expect(el.length).to.eq(thread.data.length);
    });
  };
}

export default new PilotEnvPage();
