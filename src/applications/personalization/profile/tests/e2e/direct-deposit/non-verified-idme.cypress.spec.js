import { PROFILE_PATHS } from '@@profile/constants';
import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';

import { makeUserObject } from '~/applications/personalization/common/helpers';

let getDD4CNPBankInfoStub;
let getDD4EDUBankInfoStub;

function notIDme2FAAlertShown() {
  cy.findByRole('link', {
    name: /create a verified account through ID\.me/i,
  }).should('exist');
  cy.findByText(
    /You’ll need to verify your account to edit direct deposit information/i,
  )
    .should('exist')
    .closest('.usa-alert-continue')
    .should('exist');
}

function directDepositAPIsNotCalled() {
  cy.should(() => {
    expect(getDD4CNPBankInfoStub).not.to.be.called;
    expect(getDD4EDUBankInfoStub).not.to.be.called;
  });
}

describe('Direct Deposit', () => {
  beforeEach(() => {
    // explicitly mock all required APIs to be 500s to speed up the tests
    mockGETEndpoints([
      'v0/profile/personal_information',
      'v0/profile/service_history',
      'v0/profile/full_name',
      'v0/profile/status',
      'v0/mhv_account',
      'v0/feature_toggles*',
      '/v0/disability_compensation_form/rating_info',
    ]);
    getDD4CNPBankInfoStub = cy.stub();
    getDD4EDUBankInfoStub = cy.stub();
    cy.intercept('GET', 'v0/ppiu/payment_information', () => {
      getDD4CNPBankInfoStub();
    });
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', () => {
      getDD4EDUBankInfoStub();
    });
    cy.login();
  });
  context('when user is a non-2FA ID.me user', () => {
    beforeEach(() => {
      const mockUser = makeUserObject({
        serviceName: 'idme',
        loa: 3,
        multifactor: false,
      });
      cy.intercept('GET', 'v0/user', mockUser);
    });
    it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

      notIDme2FAAlertShown();

      directDepositAPIsNotCalled();
    });
  });
  context('when user has 2FA set up but signed in with DSLogon', () => {
    beforeEach(() => {
      const mockUser = makeUserObject({
        serviceName: 'dslogon',
        loa: 3,
        multifactor: true,
      });
      cy.intercept('GET', 'v0/user', mockUser);
    });
    it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

      notIDme2FAAlertShown();

      directDepositAPIsNotCalled();
    });
  });
  context(
    'when user has 2FA set up but signed in with MHV/My HealtheVet',
    () => {
      beforeEach(() => {
        const mockUser = makeUserObject({
          serviceName: 'mhv',
          loa: 3,
          multifactor: true,
        });
        cy.intercept('GET', 'v0/user', mockUser);
      });
      it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
        cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

        notIDme2FAAlertShown();

        directDepositAPIsNotCalled();
      });
    },
  );
});
