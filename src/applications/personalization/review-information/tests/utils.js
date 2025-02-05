import mockPrefill from './fixtures/mocks/mockPrefill.json';
import mockUserAvail from './fixtures/mocks/user-transition-availabilities.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockVamc from './fixtures/mocks/vamc-ehr.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockUserUpdate from './fixtures/mocks/user-update.json';
import mockProfilePhone from './fixtures/mocks/profile-phone.json';
// TODO: Implement update for email address and mailing address
// import mockProfileEmail from './fixtures/mocks/profile-email.json';
// import mockProfileAddress from './fixtures/mocks/profile-address.json';
// import mockProfileAddressValidation from './fixtures/mocks/profile-address-validation.json';

export const cypressSetup = () => {
  Cypress.config({ scrollBehavior: 'nearest' });

  cy.intercept('/v0/in_progress_forms/WELCOME_VA_SETUP_REVIEW_INFORMATION', {
    statusCode: 200,
    body: mockPrefill,
  });

  cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
    'features',
  );
  cy.intercept('GET', '/v0/maintenance_windows', []).as('maintenanceWindows');
  cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamc).as('mockVamc');

  // contact page updates
  cy.intercept('GET', '/v0/profile/status*', mockStatus).as('mockStatus');
  cy.intercept('GET', '/v0/user?now=*', mockUserUpdate).as('mockUserUpdate');
  cy.intercept('GET', '/v0/user_transition_availabilities', mockUserAvail).as(
    'userTransitionAvailabilites',
  );
  cy.intercept('PUT', '/v0/profile/telephones', mockProfilePhone).as(
    'telephones',
  );
  // TODO: Implement update for email address and mailing address
  // cy.intercept('PUT', '/v0/profile/email_addresses', mockProfileEmail).as(
  //   'emailAddresses',
  // );
  // cy.intercept('POST', '/v0/profile/email_addresses', mockProfileEmail).as(
  //   'emailAddresses',
  // );

  // cy.intercept('PUT', '/v0/profile/addresses', mockProfileAddress);
  // cy.intercept(
  //   'POST',
  //   '/v0/profile/address_validation',
  //   mockProfileAddressValidation,
  // ).as('getAddressValidation');
};
