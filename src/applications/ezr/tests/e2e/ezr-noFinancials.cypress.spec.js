import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { goToNextPage } from './helpers';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';
import {
  advanceToHouseholdSection,
  advanceFromHouseholdToReview,
} from './helpers/household';

describe('EZR No Financial Submission', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 200,
      body: {
        ...MOCK_ENROLLMENT_RESPONSE,
        canSubmitFinancialInfo: false,
      },
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

  it('should successfully skip the household section when financial data cannot be submitted', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    advanceToHouseholdSection();

    goToNextPage('/household-information/financial-information-status');
    cy.injectAxeThenAxeCheck();

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    cy.get('va-checkbox[name="privacyAgreementAccepted"]')
      .scrollIntoView()
      .shadow()
      .find('label')
      .click();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();
    cy.location('pathname').should('include', '/confirmation');
  });
});
