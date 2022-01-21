import moment from 'moment';

import manifest from '../../manifest.json';
import featureToggles from './fixtures/feature-toggles-aiq.json';
import mockUserAiq from './fixtures/mockUserAiq';
import enrollmentStatus from './fixtures/mockEnrollmentStatus.json';
import prefillAiq from './fixtures/mockPrefillAiq.json';
import * as dobHelpers from './helpers';

describe('HCA-DOB', () => {
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.login(mockUserAiq);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: enrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: prefillAiq,
    }).as('mockSip');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('displays error message with dob less than 1900', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    cy.findAllByText(/start.+application/i, { selector: 'button' })
      .first()
      .click();
    cy.wait('@mockSip');
    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );

    dobHelpers.goToNextPage('/veteran-information/birth-information');
    cy.get('#root_veteranDateOfBirthYear')
      .clear()
      .type('1899');

    dobHelpers.goToNextPage();
    cy.get('#root_veteranDateOfBirth-error-message').should('be.visible');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays error message with dob greater than current year', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    cy.findAllByText(/start.+application/i, { selector: 'button' })
      .first()
      .click();
    cy.wait('@mockSip');
    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );

    dobHelpers.goToNextPage('/veteran-information/birth-information');
    const nextYear = new Date().getFullYear() + 1;
    cy.get('#root_veteranDateOfBirthYear')
      .clear()
      .type(nextYear);

    dobHelpers.goToNextPage();
    cy.get('#root_veteranDateOfBirth-error-message').should('be.visible');

    cy.injectAxe();
    cy.axeCheck();
  });
});
