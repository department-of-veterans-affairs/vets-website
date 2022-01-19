import Timeouts from 'platform/testing/e2e/timeouts';
import mockUser from '../fixtures/mocks/mockUser';
import mock1010Get from '../fixtures/mocks/mock1010Get';
import mock1010Put from '../fixtures/mocks/mock1010Put';

describe('SIP Load Fail Test', () => {
  it('Behaves accordingly when the load fails', () => {
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

    cy.visit('/health-care/apply/application');
    cy.get('body').should('be.visible');
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status', {
      applicationDate: '2018-01-24T00:00:00.000-06:00',
      enrollmentDate: '2018-01-24T00:00:00.000-06:00',
      preferredFacility: '987 - CHEY6',
      parsedStatus: 'none_of_the_above',
    });

    cy.title().should('contain', 'Apply for Health Care | Veterans Affairs');
    cy.get('.main .usa-button-primary', { timeout: Timeouts.slow }).should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();

    // fail to load an in progress form
    cy.intercept('GET', '/v0/in_progress_forms/1010ez', {
      body: {},
      statusCode: 500,
    });
    cy.get('.main .usa-button-primary')
      .first()
      .click();

    cy.url().should('not.contain', '/introduction');
    cy.url().should('contain', 'error');

    cy.axeCheck();

    cy.get('.usa-alert-error').should(
      'contain',
      'We’re sorry. We’re having some server issues',
    );

    // fail to find in progress form
    cy.visit('/health-care/apply/application');
    cy.get('body');

    cy.intercept('GET', '/v0/in_progress_forms/1010ez', {
      body: {},
      statusCode: 404,
    });

    cy.get('.main .usa-button-primary');
    cy.get('.main .usa-button-primary')
      .first()
      .click();

    cy.get('.usa-alert-error', { timeout: Timeouts.slow });
    cy.url().should('contain', 'error');
    cy.get('.usa-alert-error').should(
      'contain',
      'Something went wrong when we tried to find your application',
    );

    cy.visit('/health-care/apply/application');
    cy.get('body');

    cy.intercept('GET', '/v0/in_progress_forms/1010ez', {
      body: {},
      statusCode: 401,
    });

    cy.get('.main .usa-button-primary').should('exist');
    cy.get('.main .usa-button-primary')
      .first()
      .click();

    cy.get('.usa-alert-error', { timeout: Timeouts.slow });

    cy.get('.usa-alert-error').should(
      'contain',
      'You’re signed out of your account',
    );
  });
});
