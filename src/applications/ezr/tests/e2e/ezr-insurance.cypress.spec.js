import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import maxTestData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { goToNextPage } from './helpers';
import {
  INSURANCE_VIEW_FIELDS,
  MOCK_ENROLLMENT_RESPONSE,
} from '../../utils/constants';
import {
  advanceToInsurancePolicies,
  fillInsuranceInformation,
} from './helpers/insurance';

const { data: testData } = maxTestData;

describe('EZR Insurance Policies', () => {
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

  it('should successfully fill insurance information', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    advanceToInsurancePolicies(testData);

    goToNextPage('/insurance-information/policies');
    cy.get(`[name="root_${INSURANCE_VIEW_FIELDS.add}"]`).check('Y');
    cy.injectAxeThenAxeCheck();

    goToNextPage('/insurance-information/policy-information');
    fillInsuranceInformation(testData.providers[0]);

    goToNextPage('/insurance-information/policies');
    cy.get(`[name="root_${INSURANCE_VIEW_FIELDS.add}"]`).check('N');
    cy.injectAxeThenAxeCheck();

    goToNextPage('review-and-submit');

    // accept the privacy agreement
    cy.get('[name="privacyAgreementAccepted"]')
      .scrollIntoView()
      .shadow()
      .find('[type="checkbox"]')
      .check();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();
    cy.location('pathname').should('include', '/confirmation');
  });
});
