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

    PatientMessageDraftsPage.expandAllDrafts();

    cy.get(Locators.REPLY_FORM)
      .find('h3')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft ');
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify all drafts expanded', () => {
    PatientMessageDraftsPage.expandSingleDraft(2);

    PatientMessageDraftsPage.verifyExpandedDraftBody(
      updatedMultiDraftResponse,
      2,
      0,
    );

    PatientMessageDraftsPage.verifyExpandedDraftButtons(2);

    PatientMessageDraftsPage.expandSingleDraft(1);

    PatientMessageDraftsPage.verifyExpandedDraftBody(
      updatedMultiDraftResponse,
      1,
      1,
    );

    PatientMessageDraftsPage.verifyExpandedDraftButtons(1);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
