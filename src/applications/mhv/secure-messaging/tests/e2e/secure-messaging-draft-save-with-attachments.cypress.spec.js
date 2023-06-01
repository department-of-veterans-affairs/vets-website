import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';

describe('Secure Messaging Draft Save with Attachments', () => {
  it('Axe Check Draft Save with Attachments', () => {
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
    PatientComposePage.attachMessageFromFile('sample_docx.docx');
    PatientComposePage.saveDraftButton().click();
    cy.get('[visible=""] > p').should(
      'contain',
      'If you save this message as a draft',
    );
    cy.injectAxe();
    cy.axeCheck();
    // cy.realPress(['Enter']);   // useless action ?
  });
});
