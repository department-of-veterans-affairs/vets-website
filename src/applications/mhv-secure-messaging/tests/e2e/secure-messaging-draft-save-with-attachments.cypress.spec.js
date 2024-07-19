import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Secure Messaging Draft Save with Attachments', () => {
  it('Axe Check Draft Save with Attachments', () => {
    const draftsPage = new PatientMessageDraftsPage();

    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    PatientInterstitialPage.getContinueButton().should('not.exist');
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        mockDraftResponse.data.attributes.messageId
      }`,
      mockDraftResponse,
    ).as('autosaveResponse');
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_DOC);
    PatientComposePage.saveDraftButton().click();
    cy.get(Locators.FIELDS.VISIBLE_P).should('contain', Data.SAVE_MEG_AS_DRAFT);

    cy.wait('@autosaveResponse');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.realPress(['Enter']);

    cy.get('va-modal[visible]')
      .find('.va-modal-close')
      .click();

    cy.get('.sm-breadcrumb-list-item')
      .find('a')
      .click();
  });
});
