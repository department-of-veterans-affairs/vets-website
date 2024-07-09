import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts in one thread', () => {
  const draftPage = new PatientMessageDraftsPage();

  const updatedMultiDraftResponse = GeneralFunctionsPage.updatedThreadDates(
    mockMultiDraftsResponse,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(updatedMultiDraftResponse);
  });

  it('verify headers', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.ALERTS.PAGE_TITLE).should(
      'contain.text',
      `${updatedMultiDraftResponse.data[0].attributes.subject}`,
    );
    cy.get(Locators.HEADERS.DRAFTS_HEADER).should('have.text', 'Drafts');

    cy.get(Locators.BUTTONS.EDIT_DRAFTS)
      .should('be.visible')
      .and('have.text', 'Edit draft replies');

    cy.get(Locators.BUTTONS.EDIT_DRAFTS).click({
      force: true,
      waitForAnimations: true,
    });

    cy.get(Locators.REPLY_FORM)
      .find('h3')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft ');
      });
  });

  it('verify all drafts expanded', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    draftPage.expandAllDrafts();
    draftPage.verifyDraftsExpanded('true');

    draftPage.expandAllDrafts();
    draftPage.verifyDraftsExpanded('false');
  });

  it('verify single draft details', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    const receivedMessageIndex = mockMultiDraftsResponse.data.findIndex(
      el => el.attributes.folderId === 0,
    );

    // TODO fix assertion below
    // expand and verify first draft
    draftPage.expandSingleDraft(2);
    draftPage.verifyExpandedDraftButtons(2);
    draftPage.verifyExpandedSingleDraft(
      updatedMultiDraftResponse,
      2,
      receivedMessageIndex,
    );
    draftPage.expandSingleDraft(2);

    // expand and verify second draft
    draftPage.expandSingleDraft(1);
    draftPage.verifyExpandedDraftButtons(1);
    draftPage.verifyExpandedSingleDraft(
      updatedMultiDraftResponse,
      1,
      receivedMessageIndex,
    );
    draftPage.expandSingleDraft(1);
  });
});
