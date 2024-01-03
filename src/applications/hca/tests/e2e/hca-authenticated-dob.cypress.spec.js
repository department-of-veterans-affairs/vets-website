import moment from 'moment';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mockUser';
import mockUserNoDob from './fixtures/mocks/mockUserNoDob';
import mockUserInvalidDob from './fixtures/mocks/mockUserInvalidDob';
import mockEnrollmentStatus from './fixtures/mocks/mockEnrollmentStatus.json';
import mockPrefill from './fixtures/mocks/mockPrefill.json';
import { goToNextPage } from './utils';

describe('HCA-User-Authenticated-Without-DOB', () => {
  beforeEach(() => {
    cy.login(mockUserNoDob);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/health_care_applications/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'hash',
          attributes: { userPercentOfDisability: 0 },
        },
      },
    }).as('mockDisabilityRating');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: mockPrefill,
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

    cy.get('[href="#start"]')
      .first()
      .click();

    cy.wait('@mockSip');

    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );

    goToNextPage();

    cy.findAllByText(/date of birth/i, { selector: 'legend' })
      .first()
      .should('exist');

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('HCA-User-Authenticated-With-Invalid-DOB', () => {
  beforeEach(() => {
    cy.login(mockUserInvalidDob);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/health_care_applications/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'hash',
          attributes: { userPercentOfDisability: 0 },
        },
      },
    }).as('mockDisabilityRating');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('works with profile data that has an invalid date of birth ', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    cy.get('[href="#start"]')
      .first()
      .click();

    cy.wait('@mockSip');

    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );

    goToNextPage();

    cy.findAllByText(/date of birth/i, { selector: 'legend' })
      .first()
      .should('exist');

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('HCA-User-Authenticated-With-DOB', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/health_care_applications/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'hash',
          attributes: { userPercentOfDisability: 0 },
        },
      },
    }).as('mockDisabilityRating');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: mockPrefill,
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

    cy.get('[href="#start"]')
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
