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
    patientInterstitialPage.getContinueButton().click();
    draftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck();
    draftsPage.confirmDeleteDraft(mockDraftResponse);
    cy.contains('successfully deleted')
      .focused()
      .should('have.text', 'Draft was successfully deleted.');
    cy.injectAxe();
    cy.axeCheck();
  });

  it(' Delete Drafts on key press enter', () => {
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    patientInterstitialPage.getContinueButton().click();
    draftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck();
    draftsPage.confirmDeleteDraftOnEnter(mockDraftResponse);
    cy.contains('successfully deleted')
      .focused()
      .should('have.text', 'Draft was successfully deleted.');
    cy.injectAxe();
    cy.axeCheck();
  });
});
