import mockDraftFolderMetaResponse from '../fixtures/folder-drafts-metadata.json';
import mockDraftMessages from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import mockThreadResponse from '../fixtures/single-draft-response.json';

class PatientMessageDraftsPage {
  loadDrafts = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/messages**',
      mockDraftMessages,
    ).as('draftsResponse');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.wait('@draftsFolderMetaResponse');
    cy.wait('@draftsResponse');

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913',
      mockDraftResponse,
    ).as('draftMessageResponse');
    cy.intercept(
      'PUT',
      '/my_health/v1/messaging/message_drafts/7208913',
      mockDraftResponse,
    ).as('saveDraftwithAttachment');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913/thread',
      mockThreadResponse,
    ).as('draftThreadResponse');
  };

  loadDraftMessageDetails = () => {
    cy.log('loading draft message details');
    cy.contains('test').click();
    cy.wait('@draftThreadResponse');

    this.getMessageSubjectField().type(' Draft Save with Attachments');
    this.getMessageBodyField().type('Testing Save Drafts with Attachments');
  };

  getMessageSubjectField = () => {
    return cy
      .get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]');
  };

  getMessageBodyField = () => {
    return cy
      .get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]');
  };
}
export default PatientMessageDraftsPage;
