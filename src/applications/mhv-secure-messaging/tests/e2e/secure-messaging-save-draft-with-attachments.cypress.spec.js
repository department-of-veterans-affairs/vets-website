import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Secure Messaging Draft Save with Attachments', () => {
  const currentDate = GeneralFunctionsPage.getDateFormat();
  const draftsPage = new PatientMessageDraftsPage();
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
  });

  it('Draft can not be saved with attachments', () => {
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_DOC);
    PatientComposePage.saveDraftButton().click();
    draftsPage.verifySaveWithAttachmentAlert();

    cy.get(`[text="Keep editing"]`).click({ force: true });
    cy.get(Locators.BUTTONS.SAVE_DRAFT).should(`be.visible`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Draft can be saved without attachment', () => {
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_DOC);

    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        mockDraftResponse.data.attributes.messageId
      }`,
      {},
    ).as('draftSave');

    PatientComposePage.saveDraftButton().click();
    draftsPage.verifySaveWithAttachmentAlert();

    cy.get(`[text="Save draft without attachments"]`).click({ force: true });
    cy.get(Locators.ALERTS.SAVE_ALERT).should(
      `contain`,
      `message was saved on ${currentDate}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
