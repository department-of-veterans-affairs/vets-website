import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe('Secure Messaging Draft AutoSave with Attachments', () => {
  it('Axe Check Draft AutoSave with Attachments', () => {
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    const inboxPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    patientInterstitialPage.getContinueButton().click();
    composePage
      .getMessageBodyField()
      .type('Testing Autosave Drafts with Attachments');
    cy.realPress(['Enter']);
    composePage.attachMessageFromFile('sample_docx.docx');

    mockDraftResponse.data.attributes.body =
      'ststASertTesting Autosave Drafts with Attachments\n';
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        mockDraftResponse.data.attributes.messageId
      }`,
      mockDraftResponse,
    ).as('saveDraftwithAttachment');
    cy.wait('@saveDraftwithAttachment', { timeout: 8500 });

    cy.get('@saveDraftwithAttachment')
      .its('request.body')
      .should('deep.equal', {
        body: 'ststASertTesting Autosave Drafts with Attachments\n',
        category: mockDraftResponse.data.attributes.category,
        recipientId: mockDraftResponse.data.attributes.recipientId,
        subject: mockDraftResponse.data.attributes.subject,
      });

    cy.contains('Your message was saved');
    cy.injectAxe();
    cy.axeCheck();
  });
});

describe(' Draft page Message Sort', () => {
  beforeEach(() => {
    const inboxPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    const site = new SecureMessagingSite();
    const patientInterstitialPage = new PatientInterstitialPage();
    site.login();
    inboxPage.loadInboxMessages();
    cy.reload(true);
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    patientInterstitialPage.getContinueButton().click();
    draftsPage.clickDeleteButton();
    draftsPage.confirmDeleteDraft(mockDraftResponse);
    inboxPage.verifyDeleteConfirmMessage();
    cy.get('.sidebar-navigation-messages-list-header > a');
  });
  it('Sort Inbox Messages from Newest to Oldest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .should('contain', 'Newest to oldest');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Sort Inbox Messages from Oldest to Newest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('ASC', { force: true })
      .should('contain', 'newest');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Sort Inbox Messages from A to Z', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('ASC', { force: true })
      .should('contain', 'A to Z');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Sort Inbox Messages from Z to A', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .should('contain', 'Z to A');
    cy.injectAxe();
    cy.axeCheck();
  });

  afterEach(() => {
    cy.get('[data-testid="sort-button"]').click({ force: true });
  });
});
