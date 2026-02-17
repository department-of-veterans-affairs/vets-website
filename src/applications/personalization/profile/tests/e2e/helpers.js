import dd4eduNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import mockPaymentInfo from '@@profile/tests/fixtures/direct-deposits/base.json';
import personalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';

import user from '@@profile/mocks/endpoints/user';

import error500 from '@@profile/tests/fixtures/500.json';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';

export function subNavOnlyContainsAccountSecurity({
  profile2Enabled = false,
  mobile = false,
} = {}) {
  if (mobile) {
    if (profile2Enabled) {
      cy.get('va-sidenav').filter(':visible').click();
    } else {
      cy.findByRole('button', { name: /profile menu/i }).click();
    }
  }

  if (profile2Enabled) {
    cy.get(
      `va-sidenav-submenu[label="${PROFILE_PATH_NAMES.ACCOUNT_SECURITY}"]`,
    ).should('exist');
  } else {
    cy.findByRole('navigation', { name: /profile/i }).within(() => {
      cy.findAllByRole('link').should('have.length', 1);
      cy.findByRole('link', {
        name: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
      }).should('exist');
    });
  }
}

export function onlyAccountSecuritySectionIsAccessible({
  profile2Enabled = false,
}) {
  // get all of the PROFILE_PATHS _except_ for account security
  const accountSecurityLandingPageKeys = [
    'SIGNIN_INFORMATION',
    'ACCOUNT_SECURITY',
  ];
  const profilePathsExcludingAccountSecurity = Object.entries(
    PROFILE_PATHS,
  ).filter(([key]) => {
    return !accountSecurityLandingPageKeys.includes(key);
  });
  const expectedPath = profile2Enabled
    ? PROFILE_PATHS.SIGNIN_INFORMATION
    : PROFILE_PATHS.ACCOUNT_SECURITY;
  profilePathsExcludingAccountSecurity.forEach(([_, path]) => {
    cy.visit(path);
    cy.url().should('eq', `${Cypress.config().baseUrl}${expectedPath}`);
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
  cy.findByText(/Review your disability rating/i).should('not.exist');
}

export function nameTagRendersWithFallbackLink() {
  nameTagRenders();
  cy.findByText('Your disability rating:').should('not.exist');
  cy.findByText(/Review your disability rating/i).should('exist');
  cy.findByText(/service connected/i).should('not.exist');
}

export function nameTagRendersWithoutDisabilityRating() {
  nameTagRenders();
  cy.findByText('Your disability rating:').should('not.exist');
  cy.findByText(/Review your disability rating/i).should('not.exist');
  cy.findByText(/service connected/i).should('not.exist');
}

/**
 * Mock Profile-related APIs so the Notification Settings section will load.
 * This does _not_ mock the APIs used by the Notification Setting section. It
 * only mocks the other APIs that are required by the Profile
 */
export function mockNotificationSettingsAPIs(toggles) {
  mockGETEndpoints(['/v0/mhv_account']);
  cy.intercept(
    '/v0/disability_compensation_form/rating_info',
    disabilityRating,
  );
  cy.intercept('/v0/profile/full_name', fullName);
  cy.intercept('/v0/profile/personal_information', personalInformation);
  cy.intercept('/v0/profile/service_history', serviceHistory);
  cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
  cy.intercept('/v0/profile/direct_deposits', mockPaymentInfo);
  mockFeatureToggles(toggles ? () => toggles : null);
}

export function createMockTransactionResponse(step = 'RECEIVED') {
  return {
    statusCode: 200,
    body: {
      data: {
        id: step === 'COMPLETED' ? 'mock-transaction-id' : '',
        type: 'async_transaction_va_profile_mock_transactions',
        attributes: {
          transactionId: 'mock-transaction-id',
          transactionStatus: step,
          type: 'AsyncTransaction::VAProfile::MockTransaction',
          metadata: [],
        },
      },
    },
  };
}

/**
 * Mock happy path for loa3 user where all the required APIs are mocked for the profile to load.
 * Specific feature toggles should be passed in as an object, otherwise the default toggles will be used with false values
 * @param {*} toggles
 */
export function mockProfileLOA3(toggles) {
  mockGETEndpoints(['/v0/mhv_account']);
  cy.intercept(
    '/v0/disability_compensation_form/rating_info',
    disabilityRating,
  );
  cy.intercept('/v0/user', user.loa3User72);
  cy.intercept('/v0/profile/full_name', fullName);
  cy.intercept('/v0/profile/personal_information', personalInformation);
  cy.intercept('/v0/profile/service_history', serviceHistory);

  mockFeatureToggles(toggles ? () => toggles : null);
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
