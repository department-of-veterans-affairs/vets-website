import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockThreadResponse from './fixtures/single-draft-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Delete Draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const draftsPage = new PatientMessageDraftsPage();
  it(' Delete Drafts', () => {
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    PatientInterstitialPage.getContinueButton().should('not.exist');
    draftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    draftsPage.confirmDeleteDraft(mockDraftResponse, false);
    draftsPage.verifyDeleteConfirmationMessage();
    draftsPage.verifyDeleteConfirmationHasFocus();
    cy.get(Locators.FOLDERS.DRAFTS)
      .find('a')
      .should('have.class', 'is-active');
    draftsPage.verifyDraftMessageBannerTextHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
  });
});
