import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import PatientComposePage from './pages/PatientComposePage';
import manifest from '../../manifest.json';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

describe(manifest.appName, () => {
  it('Axe Check Save Draft', () => {
    const landingPage = new PatientMessagesLandingPage();
    const composePage = new PatientComposePage();
    landingPage.login();
    landingPage.loadPage(false);
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/messages**',
      mockDraftMessages,
    ).as('draftsResponse');
    cy.wait('@draftsFolderMetaResponse');
    cy.wait('@draftsResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913',
      mockDraftResponse,
    ).as('draftMessageResponse');
    cy.contains('test').click();
    cy.wait('@draftMessageResponse');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="message-body-field"]').clear();
    cy.get('[data-testid="message-body-field"]').type('message Test');
    composePage.saveDraft();
  });
});
