import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';
import { AXE_CONTEXT, Data, Locators, Alerts } from './utils/constants';

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
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_DOC);

    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        mockDraftResponse.data.attributes.messageId
      }`,

      mockDraftResponse,
    ).as('autosaveResponse');

    PatientComposePage.saveDraftButton().click();

    // verify modal elements
    cy.get(Locators.ALERTS.HEADER).should('have.text', Alerts.SAVE_ATTCH);
    PatientMessageDraftsPage.verifySaveModalButtons();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageDraftsPage.closeModal();

    cy.get(Locators.LINKS.BACK_TO_DRAFTS).click();
  });
});
