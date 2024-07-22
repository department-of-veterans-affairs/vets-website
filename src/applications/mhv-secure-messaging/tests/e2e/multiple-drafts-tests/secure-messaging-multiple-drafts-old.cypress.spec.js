import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts older than 45 days', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadMultiDraftThread(mockMultiDraftsResponse);
  });

  it('verify interface', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.HEADERS.DRAFTS_HEADER).should('have.text', 'Drafts');

    cy.get(Locators.ALERTS.EXPIRED_MESSAGE)
      .should('be.visible')
      .and('have.text', Alerts.OLD_MSG);

    cy.get(Locators.BUTTONS.EDIT_DRAFTS).should('not.exist');

    draftPage.expandSingleDraft(1);
    draftPage.verifyExpandedOldDraftButtons(1);

    draftPage.expandSingleDraft(2);
    draftPage.verifyExpandedOldDraftButtons(2);
  });
});
