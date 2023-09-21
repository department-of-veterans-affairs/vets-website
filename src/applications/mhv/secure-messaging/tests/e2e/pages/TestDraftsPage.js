import mockDraftThreads from '../fixtures/draftsResponse/drafts-messages-response.json';
import mockDraftsMetaResponse from '../fixtures/draftsResponse/folder-drafts-metadata.json';
import mockSingleThreadResponse from '../fixtures/draftsResponse/drafts-single-thread-response.json';
import mockSingleMessage from '../fixtures/draftsResponse/drafts-single-message-response.json';
import mockFoldersResponse from '../fixtures/generalResponses/folders.json';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';

class TestDraftsPage {
  loadMessages = (
    draftFolder = mockDraftsMetaResponse,
    draftThreads = mockDraftThreads,
  ) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/folders*`,
      mockFoldersResponse,
    ).as('trashFolder');

    cy.intercept('GET', `${Paths.SM_API_BASE}/folders/-2*`, draftFolder).as(
      'trashFolder',
    );
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/folders/-2/threads**`,
      draftThreads,
    ).as('draftsFolderMessages');
    cy.get(Locators.DRAFTS_BTN).click();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  };

  loadSingleThread = (
    draftThreads = mockDraftThreads,
    singleTread = mockSingleThreadResponse,
    singleMessage = mockSingleMessage,
  ) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/messages/${
        draftThreads.data[0].attributes.messageId
      }/thread`,
      singleTread,
    );
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/messages/${
        draftThreads.data[0].attributes.messageId
      }`,
      singleMessage,
    );

    cy.get('[data-testid="thread-list-item"]')
      .first()
      .within(() => {
        cy.get(
          `#message-link-${draftThreads.data[0].attributes.messageId}`,
        ).click();
      });
  };
}

export default new TestDraftsPage();
