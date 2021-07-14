import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';
import error500 from '@@profile/tests/fixtures/500.json';

export function subNavOnlyContainsAccountSecurity(mobile) {
  if (mobile) {
    cy.findByRole('button', { name: /profile menu/i }).click();
  }
  cy.findByRole('navigation', { name: /secondary/i }).within(() => {
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

export const mockFeatureToggles = () => {
  cy.server();
  cy.route({
    method: 'GET',
    status: 200,
    url: '/v0/feature_toggles*',
    response: {
      data: {
        features: [
          {
            name: 'dashboard_show_dashboard_2',
            value: true,
          },
          {
            name: 'profile_notification_settings',
            value: true,
          },
        ],
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

export function registerCypressHelpers() {
  // The main loading indicator is shown and is then removed
  Cypress.Commands.add('loadingIndicatorWorks', () => {
    // should show a loading indicator
    cy.findByRole('progressbar', { name: /loading/i }).should('exist');
    cy.injectAxeThenAxeCheck();

    // and then the loading indicator should be removed
    cy.findByRole('progressbar', { name: /loading/i }).should('not.exist');
  });
}
