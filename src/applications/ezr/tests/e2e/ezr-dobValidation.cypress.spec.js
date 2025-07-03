import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockUserNoDob from './fixtures/mocks/mock-user-no-dob';
import mockUserInvalidDob from './fixtures/mocks/mock-user-invalid-dob';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { goToNextPage } from './helpers';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';

describe('EZR user profile has no date of birth value', () => {
  beforeEach(() => {
    cy.login(mockUserNoDob);
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
  });

  it('should activate the page to allow the user to input their date of birth', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.get('[href="#start"]')
      .first()
      .click();
    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );
    goToNextPage('/veteran-information/date-of-birth');
    cy.injectAxeThenAxeCheck();
  });
});

describe('EZR user profile has invalid date of birth value', () => {
  beforeEach(() => {
    cy.login(mockUserInvalidDob);
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
  });

  it('should activate the page to allow the user to input their date of birth', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.get('[href="#start"]')
      .first()
      .click();
    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );
    goToNextPage('/veteran-information/date-of-birth');
    cy.injectAxeThenAxeCheck();
  });
});

describe('EZR user profile has valid date of birth value', () => {
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
  });

  it('should not activate the page to allow the user to input their date of birth', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.get('[href="#start"]')
      .first()
      .click();
    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );
    goToNextPage('/veteran-information/mailing-address');
    cy.injectAxeThenAxeCheck();
  });
});
