import { PROFILE_PATHS } from '@@profile/constants';
import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';

import { makeUserObject } from '~/applications/personalization/common/helpers';
import { CSP_IDS } from 'platform/user/authentication/constants';

let getDD4CNPBankInfoStub;
let getDD4EDUBankInfoStub;

function UnsupportedAccountAlertIsShown() {
  cy.findByRole('link', {
    name: /ID\.me/i,
  }).should('exist');
  cy.findByText(
    /You’ll need to verify your identity.*to update.*your direct deposit information online/i,
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
    /* This case will probably never happen in real life. I believe that you
    must set up 2FA when you verify your ID with ID.me, so a user should never
    be LOA3 _without_ also having 2FA set up. */
    beforeEach(() => {
      const mockUser = makeUserObject({
        serviceName: CSP_IDS.ID_ME,
        loa: 3,
        multifactor: false,
      });
      cy.intercept('GET', 'v0/user', mockUser);
    });
    it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

      UnsupportedAccountAlertIsShown();

      directDepositAPIsNotCalled();
    });
  });
  context('when user has 2FA set up but signed in with DSLogon', () => {
    beforeEach(() => {
      const mockUser = makeUserObject({
        serviceName: CSP_IDS.DS_LOGON,
        loa: 3,
        multifactor: true,
      });
      cy.intercept('GET', 'v0/user', mockUser);
    });
    it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

      UnsupportedAccountAlertIsShown();

      directDepositAPIsNotCalled();
    });
  });
  context(
    'when user has 2FA set up but signed in with MHV/My HealtheVet',
    () => {
      beforeEach(() => {
        const mockUser = makeUserObject({
          serviceName: CSP_IDS.MHV,
          loa: 3,
          multifactor: true,
        });
        cy.intercept('GET', 'v0/user', mockUser);
      });
      it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
        cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

        UnsupportedAccountAlertIsShown();

        directDepositAPIsNotCalled();
      });
    },
  );
});
