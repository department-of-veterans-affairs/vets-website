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

    cy.get(Locators.HEADERS.DRAFTS_HEADER).should('have.text', 'Draft replies');

    cy.get(Locators.ALERTS.EXPIRED_MESSAGE)
      .should('be.visible')
      .and('contain', Alerts.OLD_MSG_HEAD);

    // Drafts are now auto-expanded, no Edit draft button needed

    // Accordions are already expanded by default - verify buttons directly
    PatientMessageDraftsPage.verifyExpandedOldDraftButtons(1);

    PatientMessageDraftsPage.verifyExpandedOldDraftButtons(2);
  });
});
