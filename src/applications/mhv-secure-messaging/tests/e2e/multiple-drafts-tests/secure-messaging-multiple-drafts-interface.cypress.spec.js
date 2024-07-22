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

    PatientMessageDraftsPage.verifyMessagesBodyText(
      updatedMultiDraftResponse.data[0].attributes.body,
    );

    cy.get(Locators.ALERTS.EDIT_DRAFT).click();
    PatientMessageDraftsPage.verifyMessagesBodyText(
      updatedMultiDraftResponse.data[1].attributes.body,
    );
    PatientMessageDraftsPage.verifyDraftMessageBodyText(
      updatedMultiDraftResponse.data[0].attributes.body,
    );
    draftPage.expandSingleDraft(2);

    cy.get('[text="Edit draft 2"]').click();
    PatientMessageDraftsPage.verifyMessagesBodyText(
      updatedMultiDraftResponse.data[0].attributes.body,
    );
    PatientMessageDraftsPage.verifyDraftMessageBodyText(
      updatedMultiDraftResponse.data[1].attributes.body,
    );
    draftPage.expandSingleDraft(1);
  });
});
