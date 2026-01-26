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
    cy.get(Locators.HEADERS.DRAFTS_HEADER).should('have.text', 'Draft replies');

    // Verify accordion is expanded by default (button removed, auto-expand behavior)
    cy.get(Locators.REPLY_FORM)
      .find('h2')
      .should('be.visible');

    cy.get(Locators.REPLY_FORM)
      .find('h3[slot="headline"]')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft ');
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify all drafts expanded', () => {
    // Drafts auto-expand by default - no need to manually expand

    PatientMessageDraftsPage.verifyExpandedDraftBody(
      updatedMultiDraftResponse,
      2,
      0,
    );

    PatientMessageDraftsPage.verifyExpandedDraftButtons(2);

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
