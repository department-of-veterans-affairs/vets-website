import moment from 'moment';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles-with-tera.json';
import mockUser from './fixtures/mocks/mockUser';
import mockEnrollmentStatus from './fixtures/mocks/mockEnrollmentStatus.json';
import mockPrefill from './fixtures/mocks/mockPrefill.json';
import {
  acceptPrivacyAgreement,
  advanceToToxicExposure,
  advanceFromToxicExposureToReview,
  goToNextPage,
  fillGulfWarDateRange,
  fillToxicExposureDateRange,
} from './utils';

describe('HCA-Toxic-Exposure-Non-Disclosure', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
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
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('works without sharing toxic exposure service history', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    advanceToToxicExposure();

    goToNextPage('/military-service/toxic-exposure');
    cy.get('[name="root_hasTeraResponse"]').check('N');

    advanceFromToxicExposureToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('hasTeraResponse')
        .should('be.false');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('HCA-Toxic-Exposure-Disclosure', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
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
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('works when sharing minimum toxic exposure service history', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    advanceToToxicExposure();

    goToNextPage('/military-service/toxic-exposure');
    cy.get('[name="root_hasTeraResponse"]').check('Y');

    goToNextPage('/military-service/radiation-cleanup-efforts');
    cy.get('[name="root_radiationCleanupEfforts"]').check('N');

    goToNextPage('/military-service/gulf-war-service');
    cy.get('[name="root_gulfWarService"]').check('N');

    goToNextPage('/military-service/operation-support');
    cy.get('[name="root_combatOperationService"]').check('N');

    goToNextPage('/military-service/agent-orange-exposure');
    cy.get('[name="root_exposedToAgentOrange"]').check('N');

    goToNextPage('/military-service/other-toxic-exposure');

    advanceFromToxicExposureToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('hasTeraResponse')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works when sharing maximum toxic exposure service history', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    advanceToToxicExposure();

    goToNextPage('/military-service/toxic-exposure');
    cy.get('[name="root_hasTeraResponse"]').check('Y');

    goToNextPage('/military-service/radiation-cleanup-efforts');
    cy.get('[name="root_radiationCleanupEfforts"]').check('Y');

    goToNextPage('/military-service/gulf-war-service');
    cy.get('[name="root_gulfWarService"]').check('Y');

    goToNextPage('/military-service/gulf-war-service-dates');
    fillGulfWarDateRange();

    goToNextPage('/military-service/operation-support');
    cy.get('[name="root_combatOperationService"]').check('Y');

    goToNextPage('/military-service/agent-orange-exposure');
    cy.get('[name="root_exposedToAgentOrange"]').check('Y');

    goToNextPage('/military-service/other-toxic-exposure');
    cy.get(
      '[name="root_view:otherToxicExposures_exposureToAirPollutants"]',
    ).check();

    goToNextPage('/military-service/other-toxic-exposure-dates');
    fillToxicExposureDateRange();

    advanceFromToxicExposureToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('hasTeraResponse')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works when `not listed here` has been selected for other toxic exposures', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    advanceToToxicExposure();

    goToNextPage('/military-service/toxic-exposure');
    cy.get('[name="root_hasTeraResponse"]').check('Y');

    goToNextPage('/military-service/radiation-cleanup-efforts');
    cy.get('[name="root_radiationCleanupEfforts"]').check('Y');

    goToNextPage('/military-service/gulf-war-service');
    cy.get('[name="root_gulfWarService"]').check('Y');

    goToNextPage('/military-service/gulf-war-service-dates');
    fillGulfWarDateRange();

    goToNextPage('/military-service/operation-support');
    cy.get('[name="root_combatOperationService"]').check('Y');

    goToNextPage('/military-service/agent-orange-exposure');
    cy.get('[name="root_exposedToAgentOrange"]').check('Y');

    goToNextPage('/military-service/other-toxic-exposure');
    cy.get('[name="root_view:otherToxicExposures_exposureToOther"]').check();

    goToNextPage('/military-service/other-toxins-or-hazards');
    cy.get('[name="root_otherToxicExposure"]').type('sometoxinname');

    goToNextPage('/military-service/other-toxic-exposure-dates');
    fillToxicExposureDateRange();

    advanceFromToxicExposureToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('hasTeraResponse')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });
});
