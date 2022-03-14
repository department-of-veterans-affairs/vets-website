import moment from 'moment';

import manifest from '../../manifest.json';
import featureToggles from './fixtures/feature-toggles-aiq.json';
import mockUserAiq from './fixtures/mockUserAiq';
import enrollmentStatus from './fixtures/mockEnrollmentStatus.json';
import prefillServiceTest from './fixtures/mockPrefillServiceTest.json';
import * as serviceInfoHelpers from './helpers';

describe('HCA-Service-Info', () => {
  before(function beforeCypressTest() {
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
      body: prefillServiceTest,
    }).as('mockSip');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('displays error message on service start date, with age less than 15 years old ', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    const prefillDob = new Date(prefillServiceTest.formData.veteranDateOfBirth);
    const dobYear = prefillDob.getFullYear();

    serviceInfoHelpers.advanceToServiceInfoPage();

    // service start date, less than 15 years after dob
    cy.get('#root_lastEntryDateMonth').select('1');
    cy.get('#root_lastEntryDateDay').select('15');
    cy.get('#root_lastEntryDateYear')
      .clear()
      .type(dobYear + 14);

    // add valid service end date
    cy.get('#root_lastDischargeDateMonth').select('1');
    cy.get('#root_lastDischargeDateDay').select('15');
    cy.get('#root_lastDischargeDateYear')
      .clear()
      .type(dobYear + 15);

    serviceInfoHelpers.goToNextPage();
    cy.get('#root_lastEntryDate-error-message').should('be.visible');

    cy.injectAxe();
    cy.axeCheck();
  });
});
