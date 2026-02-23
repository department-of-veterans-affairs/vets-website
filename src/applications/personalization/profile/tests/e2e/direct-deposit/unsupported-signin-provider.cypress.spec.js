import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';

import {
  loa3User72,
  dsLogonUser,
  mhvUser,
} from '../../../mocks/endpoints/user';
import DirectDeposit from './page-objects/DirectDeposit';

let getDirectDeposits;

const directDeposit = new DirectDeposit();

function directDepositAPIsNotCalled() {
  cy.should(() => {
    expect(getDirectDeposits).not.to.be.called;
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
    getDirectDeposits = cy.stub();

    cy.intercept('GET', 'v0/profile/direct-deposits', () => {
      getDirectDeposits();
    });

    cy.login();
  });
  context('when user is a non-2FA ID.me user', () => {
    /* This case will probably never happen in real life. I believe that you
    must set up 2FA when you verify your ID with ID.me, so a user should never
    be LOA3 _without_ also having 2FA set up. */
    beforeEach(() => {
      directDeposit.setup();
      loa3User72.data.attributes.profile.multifactor = false;
      cy.intercept('GET', 'v0/user', loa3User72);
    });
    it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
      directDeposit.visitPage();

      directDeposit.checkVerifyMessageIsShowing();

      directDepositAPIsNotCalled();
      cy.injectAxeThenAxeCheck();
    });
  });
  context('when user has 2FA set up but signed in with DSLogon', () => {
    beforeEach(() => {
      directDeposit.setup();
      cy.intercept('GET', 'v0/user', dsLogonUser);
    });
    it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
      directDeposit.visitPage();
      directDeposit.checkVerifyMessageIsShowing();
      directDepositAPIsNotCalled();
      cy.injectAxeThenAxeCheck();
    });
  });
  context(
    'when user has 2FA set up but signed in with MHV/My HealtheVet',
    () => {
      beforeEach(() => {
        directDeposit.setup();
        cy.intercept('GET', 'v0/user', mhvUser);
      });
      it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
        directDeposit.visitPage();
        directDeposit.checkVerifyMessageIsShowing();

        directDepositAPIsNotCalled();
        cy.injectAxeThenAxeCheck();
      });
    },
  );
});
