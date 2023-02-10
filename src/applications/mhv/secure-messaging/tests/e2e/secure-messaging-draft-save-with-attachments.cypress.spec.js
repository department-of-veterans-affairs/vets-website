import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
// import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
// import mockDraftMessages from './fixtures/drafts-response.json';
// import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe('Secure Messaging Draft Save with Attachments', () => {
  // TODO this is a test for a draft with no thread messages
  // Draft with threads has a different view as a Reply Draft, which needs a separate test
  // const mockThreadResponse = { data: [] };

  it('Axe Check Draft Save with Attachments', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    const draftsPage = new PatientMessageDraftsPage();
    site.login();
    landingPage.loadPage(false);
    draftsPage.loadDrafts();
    draftsPage.loadDraftMessageDetails();
    composePage.attachMessageFromFile('sample_docx.docx');

    composePage.saveDraft(
      6978854,
      'OTHER',
      'test Draft Save with Attachments',
      'ststASertTesting Save Drafts with Attachments',
    );

    // Assertion of network response including attachment:false.
    // This verifies we are using correct mock data
    cy.get('@draft_message')
      .its('response')
      .then(res => {
        expect(res.body.data.attributes).to.include({
          attachment: false,
        });
      });

    cy.get('[visible=""] > p').should(
      'contain',
      "If you save this message as a draft, you'll need to attach your files again when you're ready to send the message.",
    );

    cy.injectAxe();
    cy.axeCheck();
    cy.realPress(['Enter']);
  });
});
