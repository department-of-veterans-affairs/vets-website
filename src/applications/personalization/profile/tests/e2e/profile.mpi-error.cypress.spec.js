import { PROFILE_PATHS } from '../../constants';

import mockMPIErrorUser from '../fixtures/users/user-mpi-error.json';

import {
  mockGETEndpoints,
  onlyAccountSecuritySectionIsAccessible,
  subNavOnlyContainsAccountSecurity,
} from './helpers';

/**
 * @param {boolean} profileShowPaperlessDelivery - feature
 * @param {boolean} mobile - test on a mobile viewport or not
 */
function test({ profileShowPaperlessDelivery = false, mobile = false } = {}) {
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);
  if (mobile) {
    cy.viewport('iphone-4');
  }

  // should show a loading indicator
  cy.get('va-loading-indicator')
    .should('exist')
    .then($container => {
      cy.wrap($container)
        .shadow()
        .findByRole('progressbar')
        .should('contain', /loading your information/i);
    });

  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');

  // should redirect to profile/account-security on load
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
  );

  // Should show an error alert about not being able to connect to MPI
  cy.findByText(/We can’t access your records/i)
    .should('exist')
    .closest('va-alert[status="warning"]')
    .should('exist');
  cy.findByText(
    /something went wrong when we tried to connect to your records/i,
  )
    .should('exist')
    .closest('va-alert[status="warning"]')
    .should('exist');

  subNavOnlyContainsAccountSecurity({ profileShowPaperlessDelivery, mobile });

  onlyAccountSecuritySectionIsAccessible();
}

describe('When user is LOA3 with 2FA turned on but we cannot connect to MPI', () => {
  beforeEach(() => {
    cy.login(mockMPIErrorUser);
    mockGETEndpoints([
      'v0/mhv_account',
      'v0/profile/ch33_bank_accounts',
      'v0/profile/full_name',
      'v0/profile/personal_information',
      'v0/profile/service_history',
      'v0/disability_compensation_form/rating_info',
      'v0/feature_toggles*',
    ]);
  });
  it('should only have access to the Account Security section at desktop size', () => {
    test();
  });
  it('should only have access to the Account Security section at mobile size', () => {
    test({ mobile: true });
  });
});

describe('When user is LOA3 with 2FA turned on but we cannot connect to MPI and feature profileShowPaperlessDelivery is true', () => {
  beforeEach(() => {
    cy.login(mockMPIErrorUser);
    mockGETEndpoints([
      'v0/mhv_account',
      'v0/profile/ch33_bank_accounts',
      'v0/profile/full_name',
      'v0/profile/personal_information',
      'v0/profile/service_history',
      'v0/disability_compensation_form/rating_info',
    ]);
    cy.intercept('GET', 'v0/feature_toggles*', {
      data: {
        features: [{ name: 'profile_show_paperless_delivery', value: true }],
      },
    });
  });
  it('should only have access to the Account Security section at desktop size', () => {
    test({ profileShowPaperlessDelivery: true });
  });
  it('should only have access to the Account Security section at mobile size', () => {
    test({ profileShowPaperlessDelivery: true, mobile: true });
  });
});
