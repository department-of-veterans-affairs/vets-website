import manifest from '../../manifest.json';
import formConfig from '../../config/form';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import maxTestData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';

describe('Form 10-10EZR Keyboard Only', () => {
  beforeEach(() => {
    cy.login(mockUser);
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
    cy.intercept('PUT', '/v0/in_progress_forms/10-10EZR', {});
    cy.intercept('POST', formConfig.submitUrl, {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2023-11-01',
      },
    }).as('mockSubmit');
  });

  it('should navigate and input maximal data using only a keyboard', () => {
    cy.wrap(maxTestData.data).as('testData');
    cy.get('@testData').then(data => {
      cy.visit(manifest.rootUrl);

      cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
      cy.injectAxeThenAxeCheck();

      cy.tabToElement('[href="#start"]');
      cy.realPress('Enter');

      cy.wait('@mockSip');
      cy.tabToElementAndPressSpace('.usa-button-primary');

      // Place of birth
      const { cityOfBirth, stateOfBirth } = data['view:placeOfBirth'];
      const prefix = '[name="root_view:placeOfBirth_';
      cy.typeInIfDataExists(`${prefix}cityOfBirth"]`, cityOfBirth);
      cy.typeInIfDataExists(`${prefix}stateOfBirth"]`, stateOfBirth);
      cy.tabToContinueForm();
    });
  });
});
