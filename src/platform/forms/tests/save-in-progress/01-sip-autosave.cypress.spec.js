// import moment from 'moment';
import Timeouts from 'platform/testing/e2e/timeouts';

import mockUser from '../fixtures/mocks/mockUser';
import mock1010Get from '../fixtures/mocks/mock1010Get';
import mock1010Put from '../fixtures/mocks/mock1010Put';

describe('SIP Autosave Test', () => {
  it('fails and properly recovers', () => {
    cy.intercept('POST', '/v0/health_care_applications', {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16',
    });
    cy.intercept('GET', '/v0/sessions/slo/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v0/sessions/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
    cy.intercept('GET', '/v0/in_progress_forms/1010ez', mock1010Get);
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', mock1010Put);
    cy.login();

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
    cy.get('.main .usa-button-primary')
      .first()
      .click();

    cy.url().should('not.contain', '/introduction');
    cy.url().should('contain', '/veteran-information/birth-information');

    cy.get('.schemaform-sip-save-link', { timeout: Timeouts.normal }).should(
      'be.visible',
    );
    cy.get('#root_veteranSocialSecurityNumber').should(
      'have.attr',
      'value',
      '123445544',
    );
    cy.fill(
      'input[name="root_view:placeOfBirth_cityOfBirth"]',
      'Northhampton, MA',
    );
    cy.get('.saved-success-container', { timeout: Timeouts.normal }).should(
      'be.visible',
    );
    cy.get('.main .usa-button-primary').click();
    cy.get('.schemaform-sip-save-link', { timeout: Timeouts.normal }).should(
      'be.visible',
    );
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', {
      statusCode: 500,
      body: {},
    });
  });
});
