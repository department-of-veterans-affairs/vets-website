import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe(' AutoSave reply Draft with Attachments', () => {
  it(' Check Draft reply AutoSave ', () => {
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    const inboxPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    cy.reload();
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    cy.reload();
    patientInterstitialPage.getContinueButton().click();
    composePage
      .getMessageBodyField()
      .type('Testing Autosave Drafts with Attachments');
    cy.realPress(['Enter']);
    composePage.attachMessageFromFile('test_video.mp4');
    composePage.verifyAttachmentErrorMessage(
      "We can't attach this file type. Try attaching a DOC, JPG, PDF, PNG, RTF, TXT, or XLS.",
    );
    composePage.attachMessageFromFile('empty.txt');
    composePage.verifyAttachmentErrorMessage(
      'Your file is empty. Try attaching a different file.',
    );

    mockDraftResponse.data.attributes.body =
      'ststASertTesting Autosave Drafts with Attachments\nTesting Autosave Drafts with Attachments\n';
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        mockDraftResponse.data.attributes.messageId
      }`,
      mockDraftResponse,
    ).as('saveDraftwithAttachment');
    cy.injectAxe();
    cy.axeCheck();
  });
});
