import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from './fixtures/draftsResponse/multi-draft-response.json';

describe('delete multiple drafts thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread();
  });

  it('verify multiple draft deletion', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    draftPage.deleteDraftMessage(
      mockMultiDraftsResponse,
      mockMultiDraftsResponse.data[0].attributes.messageId,
    );
    draftPage.verifyDeleteConfirmationMessage();
    draftPage.loadNonDeletedMultiDraftThread();
  });
});
