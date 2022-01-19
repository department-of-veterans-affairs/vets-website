import Timeouts from 'platform/testing/e2e/timeouts';
import mockUser from '../fixtures/mocks/mockUser';
import mock1010Get from '../fixtures/mocks/mock1010Get';
import mock1010Put from '../fixtures/mocks/mock1010Put';

describe('SIP Review Test', () => {
  it('Saves appropriately', () => {
    const reviewUrl = '/health-care/apply/application/review-and-submit?skip';
    cy.intercept('POST', '/v0/health_care_applications', {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16',
    });
    cy.intercept('GET', '/v1/sessions/slo/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v1/sessions/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v0/in_progress_forms/1010ez', mock1010Get);
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', mock1010Put);
    cy.login(mockUser);

    cy.visit(reviewUrl);
    cy.get('body').should('be.visible');
    cy.get('.main .usa-button-primary', { timeout: Timeouts.slow });

    cy.get(
      '.schemaform-chapter-accordion-header:first-child > .usa-button-unstyled',
    )
      .first()
      .click()
      .then(() => {
        cy.get('.edit-btn')
          .first()
          .click();
        cy.fill('input[name="root_veteranFullName_first"]', 'Jane');
        cy.get('.saved-success-container');
      });

    cy.injectAxeThenAxeCheck();

    cy.get('.schemaform-sip-save-link').click();

    cy.url()
      .should('not.contain', '/review-and-submit')
      .and('contain', 'form-saved');

    cy.visit(reviewUrl);
    cy.get('body');
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', {
      body: {},
      statusCode: 500,
    });
    cy.get('.schemaform-sip-save-link')
      .should('be.visible')
      .then(link => {
        cy.wrap(link).click();
      });

    cy.get('.usa-alert-error', { timeout: Timeouts.slow });

    cy.url().should('contain', 'review-and-submit');
    cy.get('.usa-alert-error').should(
      'contain',
      'We’re sorry. Something went wrong when saving your application',
    );
  });
});
