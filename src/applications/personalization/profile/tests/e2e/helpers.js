import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';

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
  [
    PROFILE_PATHS.CONNECTED_APPLICATIONS,
    PROFILE_PATHS.DIRECT_DEPOSIT,
    PROFILE_PATHS.MILITARY_INFORMATION,
    PROFILE_PATHS.PERSONAL_INFORMATION,
  ].forEach(path => {
    cy.visit(path);
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
    );
  });
}

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
  cy.findByText('90% Service connected').should('exist');
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
