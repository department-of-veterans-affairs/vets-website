import Timeouts from 'platform/testing/e2e/timeouts';
import mockUser from '../fixtures/mocks/mockUser';
import mockXX123Get from '../fixtures/mocks/mockXX123Get';
import mockXX123Put from '../fixtures/mocks/mockXX123Put';

describe('SIP Load Fail Test', () => {
  it('Behaves accordingly when the load fails', () => {
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

    cy.visit('/mock-sip-form');
    cy.get('body').should('be.visible');

    cy.title().should('contain', 'Mock SIP Form');
    cy.get('va-button', { timeout: Timeouts.slow }).should('be.visible');

    cy.injectAxeThenAxeCheck();

    // fail to load an in progress form
    cy.intercept('GET', '/v0/in_progress_forms/XX-123', {
      statusCode: 500,
    });
    cy.get('va-button[data-testid="continue-your-application"]')
      .first()
      .shadow()
      .find('button')
      .click();

    cy.url().should('not.contain', '/introduction');
    cy.url().should('contain', 'error');

    cy.axeCheck();

    cy.get('.usa-alert-error').should(
      'contain',
      'We’re sorry. We’re having some server issues',
    );

    // fail to find in progress form
    cy.visit('/mock-sip-form');
    cy.get('body');

    cy.intercept('GET', '/v0/in_progress_forms/XX-123', {
      statusCode: 404,
    });

    cy.get('va-button[data-testid="continue-your-application"]')
      .first()
      .shadow()
      .find('button')
      .click();

    cy.get('.usa-alert-error', { timeout: Timeouts.slow });
    cy.url().should('contain', 'error');
    cy.get('.usa-alert-error').should(
      'contain',
      'Something went wrong when we tried to find your application',
    );

    cy.visit('/mock-sip-form');
    cy.get('body');

    cy.intercept('GET', '/v0/in_progress_forms/XX-123', {
      statusCode: 401,
    });

    cy.get('.main va-button').should('exist');
    cy.get('.main va-button')
      .first()
      .shadow()
      .find('button')
      .click();

    cy.get('.usa-alert-error', { timeout: Timeouts.slow });

    cy.get('.usa-alert-error').should(
      'contain',
      'You’re signed out of your account',
    );
  });
});
