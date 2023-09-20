import mockDraftThreads from '../fixtures/draftsResponse/drafts-messages-response.json';
import mockDraftsMetaResponse from '../fixtures/draftsResponse/folder-drafts-metadata.json';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';

class TestDraftsPage {
  loadMessages = (
    draftFolder = mockDraftsMetaResponse,
    draftThreads = mockDraftThreads,
  ) => {
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

  loadSingleThread = () => {
    cy.get('[data-testid="thread-list-item"]')
      .last()
      .click();
  };
}

export default new TestDraftsPage();
