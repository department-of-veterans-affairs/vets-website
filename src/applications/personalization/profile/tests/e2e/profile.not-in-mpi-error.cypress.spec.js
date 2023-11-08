import { PROFILE_PATHS } from '../../constants';

import mockUserNotInMPI from '../fixtures/users/user-not-in-mpi.json';

import {
  mockGETEndpoints,
  onlyAccountSecuritySectionIsAccessible,
  subNavOnlyContainsAccountSecurity,
} from './helpers';

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 */
function test(mobile = false) {
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);
  if (mobile) {
    cy.viewport('iphone-4');
  }

  // should redirect to profile/account-security on load
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
  );

  // Should show a "not in MPI" error
  cy.findByText(/We can’t match your information with our Veteran records/i)
    .should('exist')
    .closest('va-alert')
    .should('exist');
  cy.findByText(/Try again soon/i)
    .should('exist')
    .closest('va-alert')
    .should('exist');

  // should redirect to profile/account-security on load
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
  );

  cy.injectAxeThenAxeCheck();

  subNavOnlyContainsAccountSecurity(mobile);

  onlyAccountSecuritySectionIsAccessible();
}

let getPersonalInfoStub;
let getDD4EDUBankInfoStub;
let getServiceHistoryStub;
let getDisabilityInfoStub;
let getFullNameStub;

describe('When user is LOA3 with 2FA turned on but we cannot connect to MPI', () => {
  beforeEach(() => {
    cy.login(mockUserNotInMPI);
    mockGETEndpoints([
      'v0/mhv_account',
      'v0/profile/ch33_bank_accounts',
      'v0/profile/full_name',
      'v0/profile/personal_information',
      'v0/profile/service_history',
      'v0/disability_compensation_form/rating_info',
      'v0/feature_toggles*',
    ]);
    getDD4EDUBankInfoStub = cy.stub();
    getFullNameStub = cy.stub();
    getPersonalInfoStub = cy.stub();
    getServiceHistoryStub = cy.stub();
    getDisabilityInfoStub = cy.stub();
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', () => {
      getDD4EDUBankInfoStub();
    });
    cy.intercept('GET', 'v0/profile/full_name', () => {
      getFullNameStub();
    });
    cy.intercept('GET', 'v0/profile/personal_information', () => {
      getPersonalInfoStub();
    });
    cy.intercept('GET', 'v0/profile/service_history', () => {
      getServiceHistoryStub();
    });
    cy.intercept('GET', 'v0/disability_compensation_form/rating_info', () => {
      getDisabilityInfoStub();
    });
  });
  it('should only have access to the Account Security section at desktop size', () => {
    test();
  });
  it('should only have access to the Account Security section at mobile size', () => {
    test(true);
  });
  it('should not call profile apis', () => {
    test();
    cy.should(() => {
      expect(getDD4EDUBankInfoStub).not.to.be.called;
      expect(getFullNameStub).not.to.be.called;
      expect(getPersonalInfoStub).not.to.be.called;
      expect(getServiceHistoryStub).not.to.be.called;
      expect(getDisabilityInfoStub).not.to.be.called;
    });
  });
});
