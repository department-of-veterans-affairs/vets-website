import moment from 'moment';

import manifest from '../../manifest.json';
import featureToggles from './fixtures/feature-toggles-aiq.json';
import enrollmentStatus from './fixtures/mockEnrollmentStatus.json';
import * as dobHelpers from './helpers';
import maxTestData from './fixtures/schema/maximal-test.json';

const testData = maxTestData.data;

describe('HCA-DOB', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: enrollmentStatus,
    }).as('mockEnrollmentStatus');
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

    cy.findAllByText(/start.+without signing in/i, { selector: 'button' })
      .first()
      .click();

    cy.findByLabelText(/first name/i).type(testData.veteranFullName.first);
    cy.findByLabelText(/last name/i).type(testData.veteranFullName.last);

    const [year, month, day] = testData.veteranDateOfBirth
      .split('-')
      .map(dateComponent => parseInt(dateComponent, 10).toString());
    cy.findByLabelText(/month/i).select(month);
    cy.findByLabelText(/day/i).select(day);
    cy.findByLabelText(/year/i).type(year);

    cy.findByLabelText(/social security/i).type(
      testData.veteranSocialSecurityNumber,
    );
    dobHelpers.goToNextPage('veteran-information/profile-information');
    dobHelpers.goToNextPage('veteran-information/profile-information-ssn');
    dobHelpers.goToNextPage('veteran-information/profile-information-dob');

    cy.location('pathname').should(
      'include',
      '/veteran-information/profile-information-dob',
    );

    cy.findByLabelText(/month/i).select('1');
    cy.findByLabelText(/day/i).select('1');
    cy.findByLabelText(/year/i).type('1899');

    dobHelpers.goToNextPage();
    cy.get('#root_veteranDateOfBirth-error-message').should('be.visible');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays error message with dob greater than current year', () => {
    cy.visit(manifest.rootUrl);

    cy.findAllByText(/start.+without signing in/i, { selector: 'button' })
      .first()
      .click();

    cy.findByLabelText(/first name/i).type(testData.veteranFullName.first);
    cy.findByLabelText(/last name/i).type(testData.veteranFullName.last);

    const [year, month, day] = testData.veteranDateOfBirth
      .split('-')
      .map(dateComponent => parseInt(dateComponent, 10).toString());
    cy.findByLabelText(/month/i).select(month);
    cy.findByLabelText(/day/i).select(day);
    cy.findByLabelText(/year/i).type(year);

    cy.findByLabelText(/social security/i).type(
      testData.veteranSocialSecurityNumber,
    );
    dobHelpers.goToNextPage('veteran-information/profile-information');
    dobHelpers.goToNextPage('veteran-information/profile-information-ssn');
    dobHelpers.goToNextPage('veteran-information/profile-information-dob');

    cy.location('pathname').should(
      'include',
      '/veteran-information/profile-information-dob',
    );

    const nextYear = new Date().getFullYear() + 1;

    cy.findByLabelText(/month/i).select('1');
    cy.findByLabelText(/day/i).select('1');
    cy.findByLabelText(/year/i).type(nextYear);

    dobHelpers.goToNextPage();
    cy.get('#root_veteranDateOfBirth-error-message').should('be.visible');

    cy.injectAxe();
    cy.axeCheck();
  });
});
