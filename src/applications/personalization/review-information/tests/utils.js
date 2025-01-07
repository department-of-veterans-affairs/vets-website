import mockUser from './fixtures/mocks/user.json';
import mockUserAvail from './fixtures/mocks/user-transition-availabilities.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockVamc from './fixtures/mocks/vamc-ehr.json';

// Profile specific responses
import mockStatus from './fixtures/mocks/profile-status.json';
import mockUserUpdate from './fixtures/mocks/user-update.json';
import mockProfilePhone from './fixtures/mocks/profile-phone.json';
import mockProfileEmail from './fixtures/mocks/profile-email.json';
import mockProfileAddress from './fixtures/mocks/profile-address.json';
import mockProfileAddressValidation from './fixtures/mocks/profile-address-validation.json';

export const cypressSetup = ({ user = mockUser } = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
    'features',
  );
  cy.intercept('GET', '/v0/maintenance_windows', []);
  cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamc);

  // contact page updates
  cy.intercept('GET', '/v0/profile/status*', mockStatus);
  cy.intercept('GET', '/v0/user?now=*', mockUserUpdate);
  cy.intercept('GET', '/v0/user_transition_availabilities', mockUserAvail);
  cy.intercept('PUT', '/v0/profile/telephones', mockProfilePhone);
  cy.intercept('PUT', '/v0/profile/email_addresses', mockProfileEmail);
  cy.intercept('PUT', '/v0/profile/addresses', mockProfileAddress);
  cy.intercept(
    'POST',
    '/v0/profile/address_validation',
    mockProfileAddressValidation,
  ).as('getAddressValidation');

  cy.login(user);
};

export const goToNextPage = pagePath => {
  // Clicks Continue button, and optionally checks destination path.
  // eslint-disable-next-line cypress/unsafe-to-chain-command
  cy.findAllByText(/continue|confirm/i, { selector: 'button' })
    .first()
    .scrollIntoView()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};
