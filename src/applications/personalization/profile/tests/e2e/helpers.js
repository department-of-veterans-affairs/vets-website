import dd4eduNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import mockPaymentInfoNotEligible from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-eligible.json';
import personalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';

import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
import user from '@@profile/mocks/endpoints/user';

import error500 from '@@profile/tests/fixtures/500.json';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';

export function subNavOnlyContainsAccountSecurity(mobile) {
  if (mobile) {
    cy.findByRole('button', { name: /profile menu/i }).click();
  }
  cy.findByRole('navigation', { name: /profile/i }).within(() => {
    cy.findAllByRole('link').should('have.length', 1);
    cy.findByRole('link', {
      name: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
    }).should('exist');
  });
}

export function onlyAccountSecuritySectionIsAccessible() {
  // get all of the PROFILE_PATHS _except_ for account security
  const profilePathsExcludingAccountSecurity = Object.entries(
    PROFILE_PATHS,
  ).filter(([key]) => {
    return key !== 'ACCOUNT_SECURITY';
  });
  profilePathsExcludingAccountSecurity.forEach(([_, path]) => {
    cy.visit(path);
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
    );
  });
}

// Pass in an array of GET endpoints you want to mock. All endpoints will be
// mocked with the same statusCode and response body, both of which can be
// specified as optional arguments
export const mockGETEndpoints = (
  endpoints,
  statusCode = 500,
  body = error500,
) => {
  endpoints.forEach(endpoint => {
    cy.intercept('GET', endpoint, {
      statusCode,
      body,
    });
  });
};

export const mockFeatureToggles = (featureToggleGenerator = null) => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    statusCode: 200,
    body: featureToggleGenerator
      ? featureToggleGenerator()
      : {
          data: {
            features: [{}],
          },
        },
  });
};

function nameTagRenders() {
  cy.findByTestId('name-tag').should('exist');
  cy.findByText('Wesley Watson Ford').should('exist');
  cy.findByText('United States Air Force').should('exist');
}

export function nameTagRendersWithDisabilityRating() {
  nameTagRenders();
  cy.findByText('Your disability rating:').should('exist');
  cy.findByText('90% service connected').should('exist');
  cy.findByText(/View disability rating/i).should('not.exist');
}

export function nameTagRendersWithFallbackLink() {
  nameTagRenders();
  cy.findByText('Your disability rating:').should('not.exist');
  cy.findByText(/View disability rating/i).should('exist');
  cy.findByText(/service connected/i).should('not.exist');
}

export function nameTagRendersWithoutDisabilityRating() {
  nameTagRenders();
  cy.findByText('Your disability rating:').should('not.exist');
  cy.findByText(/View disability rating/i).should('not.exist');
  cy.findByText(/service connected/i).should('not.exist');
}

// Mock Profile-related APIs so the Notification Settings section will load.
// This does _not_ mock the APIs used by the Notification Setting section. It
// only mocks the other APIs that are required by the Profile
export function mockNotificationSettingsAPIs() {
  mockGETEndpoints(['/v0/mhv_account']);
  cy.intercept(
    '/v0/disability_compensation_form/rating_info',
    disabilityRating,
  );
  cy.intercept('/v0/profile/full_name', fullName);
  cy.intercept('/v0/profile/personal_information', personalInformation);
  cy.intercept('/v0/profile/service_history', serviceHistory);
  cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
  cy.intercept('/v0/ppiu/payment_information', mockPaymentInfoNotEligible);
  mockFeatureToggles();
}

// Mock happy path for loa3 user
// all the required APIs are mocked for the profile to load in general
// all feature toggles are mocked to be true
export function mockProfileLOA3() {
  mockGETEndpoints(['/v0/mhv_account']);
  cy.intercept(
    '/v0/disability_compensation_form/rating_info',
    disabilityRating,
  );
  cy.intercept('/v0/profile/full_name', fullName);
  cy.intercept('/v0/profile/personal_information', personalInformation);
  cy.intercept('/v0/profile/service_history', serviceHistory);
  cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
  cy.intercept('/v0/ppiu/payment_information', mockPaymentInfoNotEligible);
  cy.intercept('/v0/user', user.loa3User72);

  const togglesAllOn = true;
  mockFeatureToggles(() => generateFeatureToggles({}, togglesAllOn));
}

export function registerCypressHelpers() {
  // The main loading indicator is shown and is then removed
  Cypress.Commands.add('loadingIndicatorWorks', () => {
    // should show a loading indicator
    cy.findByTestId('loading-indicator', { name: /loading/i }).should('exist');
    cy.injectAxeThenAxeCheck();

    // and then the loading indicator should be removed
    cy.findByRole('loading-indicator', { name: /loading/i }).should(
      'not.exist',
    );
  });
}
