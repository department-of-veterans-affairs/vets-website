import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

import manifest from '../../manifest.json';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

describe(manifest.appName, () => {
  it('Axe Check Delete Draft', () => {
    const landingPage = new PatientMessagesLandingPage();

    landingPage.login();
    landingPage.loadPage(false);
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
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();

    cy.wait('@draftsFolderMetaResponse');
    cy.wait('@draftsResponse');
    // cy.get(':nth-child(3) > .message-subject-link').click();
    cy.contains('Appointment:').click();

    cy.get('[data-testid="discard-draft-button"]').click({ force: true });

    cy.get('[data-testid="discard-draft-modal"] > p').should('be.visible');
    cy.get('[data-testid="discard-draft-modal"]')
      .shadow()
      .find('[type ="button"]', { force: true })
      .contains('Discard draft')
      .should('contain', 'Discard')
      .click({ force: true });

    cy.wait('@deletedDraftResponse');
    cy.get('.vads-u-margin-y--0').should(
      'have.text',
      'Draft was successfully discarded.',
    );
  });
});
