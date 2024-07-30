import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts in one thread', () => {
  const updatedMultiDraftResponse = GeneralFunctionsPage.updatedThreadDates(
    mockMultiDraftsResponse,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadMultiDraftThread(updatedMultiDraftResponse);
  });

  it('verify headers', () => {
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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  // TODO this test should be refactored in one of further sprints
  it('verify all drafts expanded', () => {
    // SCENARIO: click expand all link
    // verify all elements visible

    PatientMessageDraftsPage.expandSingleDraft(2);

    cy.get('[open="true"]')
      .find('.thread-list-draft')
      .should('contain.text', 'Draft 2');

    cy.get(`[open="true"]`)
      .find(`[data-testid="draft-reply-to"]`)
      .should(
        'contain.text',
        updatedMultiDraftResponse.data[0].attributes.recipientName,
      );

    // cy.get(`[open="true"]`).find(`#input-type-textarea`).should('contain.text', updatedMultiDraftResponse.data[0].attributes.messageBody)
    // PatientMessageDraftsPage.verifyMessagesBodyText(
    //   updatedMultiDraftResponse.data[0].attributes.messageBody,
    // );

    // cy.get(Locators.ALERTS.EDIT_DRAFT).click();
    // PatientMessageDraftsPage.verifyMessagesBodyText(
    //   updatedMultiDraftResponse.data[1].attributes.body,
    // );
    // PatientMessageDraftsPage.verifyDraftMessageBodyText(
    //   updatedMultiDraftResponse.data[0].attributes.body,
    // );
    // PatientMessageDraftsPage.expandSingleDraft(2);

    // cy.get('[text="Edit draft 2"]').click();
    // PatientMessageDraftsPage.verifyMessagesBodyText(
    //   updatedMultiDraftResponse.data[0].attributes.body,
    // );
    // PatientMessageDraftsPage.verifyDraftMessageBodyText(
    //   updatedMultiDraftResponse.data[1].attributes.body,
    // );
    // PatientMessageDraftsPage.expandSingleDraft(1);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
