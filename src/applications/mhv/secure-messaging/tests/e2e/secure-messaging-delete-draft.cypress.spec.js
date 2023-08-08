import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockThreadResponse from './fixtures/single-draft-response.json';

describe('Secure Messaging Delete Draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const draftsPage = new PatientMessageDraftsPage();
  const patientInterstitialPage = new PatientInterstitialPage();
  it(' Delete Drafts', () => {
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    patientInterstitialPage.getContinueButton().should('not.exist');
    draftsPage.clickDeleteButton();
    // cy.injectAxe();
    // cy.axeCheck('main', {
    //   rules: {
    //     'aria-required-children': {
    //       enabled: false,
    //     },
    //   },
    // });
    // draftsPage.confirmDeleteDraft(mockDraftResponse);
    draftsPage.confirmDeleteDraftWithEnterKey(mockDraftResponse);
    inboxPage.verifyDeleteConfirmMessage();
    // cy.injectAxe();
    // cy.axeCheck('main', {
    //   rules: {
    //     'aria-required-children': {
    //       enabled: false,
    //     },
    //   },
    // });
  });
});
