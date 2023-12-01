import Timeouts from 'platform/testing/e2e/timeouts';
import mockUser from '../fixtures/mocks/mockUser';
import mockXX123Get from '../fixtures/mocks/mockXX123Get';
import mockXX123Put from '../fixtures/mocks/mockXX123Put';

describe('SIP Review Test', () => {
  it('Saves appropriately', () => {
    const reviewUrl = '/mock-sip-form/review-and-submit?skip';
    cy.intercept('POST', '/v0/mock_sip_form', {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16',
    });
    cy.intercept('GET', '/v1/sessions/slo/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v1/sessions/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v0/in_progress_forms/XX-123', mockXX123Get);
    cy.intercept('PUT', '/v0/in_progress_forms/XX-123', mockXX123Put);
    cy.login(mockUser);

    cy.visit(reviewUrl);
    cy.get('body').should('be.visible');
    cy.get('.main .usa-button-primary', { timeout: Timeouts.slow });

    cy.get('va-accordion-item')
      .first()
      .click()
      .then(() => {
        cy.get("va-button[text='edit']")
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
    cy.intercept('PUT', '/v0/in_progress_forms/XX-123', {
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
