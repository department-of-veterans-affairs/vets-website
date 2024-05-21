import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts older than 45 days', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(mockMultiDraftsResponse);
  });

  it('verify interface', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.MULT_DRAFT_HEADER).should('have.text', 'Drafts');

    cy.get(Locators.ALERTS.EXPIRED_MESSAGE)
      .should('be.visible')
      .and('include.text', 'too old');

    draftPage.expandSingleDraft(2);
    cy.get('[open="true"] > :nth-child(6) > .compose-form-actions')
      .find('[data-testid="delete-draft-button"]')
      .should('be.visible')
      .and('have.text', `Delete draft 2`);

    cy.get(Locators.BUTTONS.SEND).should('not.exist');
    cy.get(Locators.BUTTONS.SEND).should('not.exist');
  });
});
