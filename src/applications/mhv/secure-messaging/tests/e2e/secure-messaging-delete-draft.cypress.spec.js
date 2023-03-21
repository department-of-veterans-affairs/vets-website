import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';

describe('Secure Messaging Delete Draft', () => {
  it('Axe Check Delete Draft', () => {
    const mockThreadResponse = { data: [] };
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/threads**',
      mockDraftMessages,
    ).as('draftsResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913',
      mockDraftResponse,
    ).as('draftMessageResponse');
    cy.intercept(
      'DELETE',
      '/my_health/v1/messaging/messages/7208913',
      mockDraftMessages,
    ).as('deletedDraftResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913/thread',
      mockThreadResponse,
    ).as('draftThreadResponse');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();

    cy.wait('@draftsFolderMetaResponse');
    cy.wait('@draftsResponse');

    // cy.get(':nth-child(3) > .message-subject-link').click();
    cy.contains('Appointment:').click();
    cy.wait('@draftThreadResponse');
    cy.get('[data-testid="delete-draft-button"]').click({ force: true });

    cy.get('[data-testid="delete-draft-modal"] > p').should('be.visible');
    cy.get('[data-testid="delete-draft-modal"]')
      .shadow()
      .find('[type ="button"]', { force: true })
      .contains('Delete draft')
      .should('contain', 'Delete')
      .click({ force: true });

    cy.wait('@deletedDraftResponse');
    cy.contains('successfully deleted').should(
      'have.text',
      'Draft was successfully deleted.',
    );
  });
});
