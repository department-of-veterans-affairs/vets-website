/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import maxTestData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { goToNextPage } from './helpers';
import {
  DEPENDENT_VIEW_FIELDS,
  MOCK_ENROLLMENT_RESPONSE,
} from '../../utils/constants';
import {
  advanceFromDependentsToReview,
  advanceToDependents,
  fillDependentInformation,
} from './helpers/dependents';

const { data: testData } = maxTestData;

function submitDependentInformation(dependent, showIncomePages) {
  // Set up intercepts before visiting
  cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
    'mockFeatures',
  );
  cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
    statusCode: 200,
    body: MOCK_ENROLLMENT_RESPONSE,
  }).as('mockEnrollmentStatus');
  cy.intercept('GET', '/v0/in_progress_forms/10-10EZR', {
    statusCode: 200,
    body: mockPrefill,
  }).as('mockSip');
  cy.intercept('PUT', '/v0/in_progress_forms/10-10EZR', {
    statusCode: 200,
    body: mockPrefill,
  }).as('mockSipUpdate');

  // Visit page after setting up intercepts
  cy.visit(manifest.rootUrl, { timeout: 30000 });

  // Wait for the page to be fully loaded before proceeding
  // Use a more generic selector that should exist on any page
  cy.get('body', { timeout: 30000 }).should('be.visible');
  cy.get('[href="#start"]', { timeout: 30000 }).should('be.visible');

  advanceToDependents();

  goToNextPage('/household-information/dependents');
  // Use force option to handle element being covered
  cy.get(`[name="root_${DEPENDENT_VIEW_FIELDS.add}"]`).check('Y', {
    force: true,
  });
  cy.injectAxeThenAxeCheck();

  goToNextPage('/household-information/dependent-information');
  fillDependentInformation(dependent, showIncomePages);

  goToNextPage('/household-information/dependents');
  // Use force option to handle element being covered
  cy.get(`[name="root_${DEPENDENT_VIEW_FIELDS.add}"]`).check('N', {
    force: true,
  });
  cy.injectAxeThenAxeCheck();

  advanceFromDependentsToReview(testData);

  // accept the privacy agreement
  cy.get('va-checkbox[name="privacyAgreementAccepted"]')
    .scrollIntoView()
    .shadow()
    .find('label')
    .click();

  // submit form
  cy.findByText(/submit/i, { selector: 'button' }).click();
  cy.location('pathname').should('include', '/confirmation');
}

describe('EZR Dependents', () => {
  beforeEach(() => {
    // Clear any previous state
    cy.clearCookies();
    cy.clearLocalStorage();

    // Set up API mocks
    cy.intercept('POST', formConfig.submitUrl, {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2023-11-01',
      },
    }).as('mockSubmit');

    // Mock services for route guard
    cy.intercept('GET', '/v0/user/services', {
      statusCode: 200,
      body: {
        facilities: true,
        identityProofed: true,
        userProfile: true,
      },
    }).as('mockServices');

    // Login the user first
    cy.login(mockUser);

    // Visit a neutral page first to ensure clean state
    cy.visit('/', { timeout: 30000 });
    cy.get('body', { timeout: 30000 }).should('be.visible');

    // Then override environment after login with longer timeout
    cy.window({ timeout: 30000 }).then(win => {
      // Create a mock environment object
      const mockEnvironment = {
        isLocalhost: () => true,
        isDev: () => false,
        isStaging: () => false,
        isProduction: () => false,
      };

      // Replace the entire environment object
      Object.defineProperty(win, 'environment', {
        value: mockEnvironment,
        configurable: true,
      });
    });
  });

  describe('default behavior with maximum data', () => {
    it('should successfully fill dependent information', () => {
      submitDependentInformation(testData.dependents[0], true);
    });
  });

  describe('dependent is between 18 and 23 years old and earned no income', () => {
    it('does not show the income or education expenses pages, but still successfully fills the other dependent information', () => {
      submitDependentInformation(testData.dependents[1], false);
    });
  });
});
