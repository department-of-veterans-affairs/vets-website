import moment from 'moment';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/feature-toggles-shortForm.json';
import mockUserAiq from './fixtures/mockUserAiq';
import mockIdentityNoDob from './fixtures/mockIdentityNoDob';
import enrollmentStatus from './fixtures/mockEnrollmentStatus.json';
import prefillAiq from './fixtures/mockPrefillAiq.json';

describe('HCA-User-Authenticated-Identity-Without-DOB', () => {
  beforeEach(() => {
    cy.login(mockIdentityNoDob);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: enrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/disability_compensation_form/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'evss_disability_compensation_form_rating_info_responses',
          attributes: { userPercentOfDisability: 0 },
        },
      },
    }).as('mockDisabilityRating');
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

  it('works with profile data that has no date of birth ', () => {
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

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    cy.findAllByText(/date of birth/i, { selector: 'legend' })
      .first()
      .should('exist');

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('HCA-User-Authenticated-Identity-With-DOB', () => {
  beforeEach(() => {
    cy.login(mockUserAiq);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: enrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/disability_compensation_form/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'evss_disability_compensation_form_rating_info_responses',
          attributes: { userPercentOfDisability: 0 },
        },
      },
    }).as('mockDisabilityRating');
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

  it('works with profile data that has date of birth ', () => {
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

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    cy.findAllByText(/place of birth/i, { selector: 'legend' })
      .first()
      .should('exist');

    cy.injectAxe();
    cy.axeCheck();
  });
});
