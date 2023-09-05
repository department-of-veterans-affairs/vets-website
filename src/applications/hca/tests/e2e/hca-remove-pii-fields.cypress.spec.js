import moment from 'moment';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles-pii.json';
import mockEnrollmentStatus from './fixtures/mocks/mockEnrollmentStatus.json';
import minTestData from './fixtures/data/minimal-test.json';
import { goToNextPage } from './utils';

const { data: testData } = minTestData;

describe('HCA-Remove-PII-Fields-UnAuthenticated', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('should advance to place of birth page after validating user', () => {
    cy.visit(manifest.rootUrl);

    cy.get('.schemaform-start-button')
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

    goToNextPage('/veteran-information/personal-information');
    goToNextPage('/veteran-information/birth-information');

    cy.injectAxe();
    cy.axeCheck();
  });
});
