import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import mockSentFolderMetaResponse from '../fixtures/sentResponse/folder-sent-metadata.json';

class PatientMessageCustomFolderPage {
  loadMessages = (mockMessagesResponse = mockSentMessages) => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1',
      mockSentFolderMetaResponse,
    ).as('sentFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/threads**',
      mockMessagesResponse,
    ).as('sentFolderMessages');
    cy.get('[data-testid="sent-sidebar"]').click();
  };
}

export default new PatientMessageCustomFolderPage();
