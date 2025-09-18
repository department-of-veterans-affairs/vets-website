import mockResponses from './fixtures/mocks/local-mock-responses.js';

describe('21P-0537 Form Submission', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      mockResponses['GET /v0/feature_toggles'],
    );
    cy.intercept('GET', '/v0/user', mockResponses['GET /v0/user']);
    cy.intercept(
      'GET',
      '/v0/in_progress_forms/21P-0537',
      mockResponses['GET /v0/in_progress_forms/21P-0537'],
    );
    cy.intercept(
      'PUT',
      '/v0/in_progress_forms/21P-0537',
      mockResponses['PUT /v0/in_progress_forms/21P-0537'],
    );
    cy.intercept(
      'POST',
      '/simple_forms_api/v1/simple_forms',
      mockResponses['POST /simple_forms_api/v1/simple_forms'],
    );
  });

  it('should submit the form with new PDF mappings', () => {
    cy.visit('/pension/dic/marital-status-questionnaire-21p-0537');

    // Fill out form (basic test)
    cy.get('[data-testid="hasRemarried-yes"]').click();

    // Continue through form pages...
    cy.get('.usa-button-primary')
      .contains('Continue')
      .click();

    // Submit form
    cy.get('.usa-button-primary')
      .contains('Submit')
      .click();

    // Verify submission success
    cy.contains('21P-0537-047e841c-28b5-45f5-b2c7-f4ee865c9bb4').should(
      'be.visible',
    );
  });
});
