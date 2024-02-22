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
  cy.visit(manifest.rootUrl);
  cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

  advanceToDependents();

  goToNextPage('/household-information/dependents');
  cy.get(`[name="root_${DEPENDENT_VIEW_FIELDS.add}"]`).check('Y');
  cy.injectAxeThenAxeCheck();

  goToNextPage('/household-information/dependent-information');
  fillDependentInformation(dependent, showIncomePages);

  goToNextPage('/household-information/dependents');
  cy.get(`[name="root_${DEPENDENT_VIEW_FIELDS.add}"]`).check('N');
  cy.injectAxeThenAxeCheck();

  advanceFromDependentsToReview(testData);

  // accept the privacy agreement
  cy.get('[name="privacyAgreementAccepted"]')
    .scrollIntoView()
    .shadow()
    .find('[type="checkbox"]')
    .check();

  // submit form
  cy.findByText(/submit/i, { selector: 'button' }).click();
  cy.location('pathname').should('include', '/confirmation');
}

describe('EZR Dependents', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 200,
      body: MOCK_ENROLLMENT_RESPONSE,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/10-10EZR', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
    cy.intercept('POST', formConfig.submitUrl, {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2023-11-01',
      },
    }).as('mockSubmit');
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
