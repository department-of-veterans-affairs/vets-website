import mockDraftMessages from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockThreadResponse from '../fixtures/single-draft-response.json';

describe('Secure Messaging Delete Draft', () => {
  it(' Delete Drafts on key press', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDraftMessages(
      mockDraftMessages,
      mockDraftResponse,
    );
    PatientMessageDraftsPage.loadMessageDetails(
      mockDraftResponse,
      mockThreadResponse,
    );
    PatientInterstitialPage.getContinueButton().click();
    PatientMessageDraftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck();
    PatientMessageDraftsPage.confirmDeleteDraftWithEnterKey(mockDraftResponse);
    cy.get('.vads-u-margin-bottom--1').should('have.focus');
    cy.injectAxe();
    cy.axeCheck();
  });
});
