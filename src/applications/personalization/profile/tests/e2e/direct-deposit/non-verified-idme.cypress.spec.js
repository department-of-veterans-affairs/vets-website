import { PROFILE_PATHS } from '@@profile/constants';

import { makeUserObject } from '~/applications/personalization/common/helpers';

function notIDme2FAAlertShown() {
  cy.findByRole('button', { name: /set up 2-factor authentication/i }).should(
    'exist',
  );
  cy.findByText(
    /You’ll need to set up 2-factor authentication before you can edit your direct deposit information/i,
  )
    .should('exist')
    .closest('.usa-alert-continue')
    .should('exist');
}

describe.skip('Direct Deposit', () => {
  let getDD4CNPBankInfoStub;
  let getDD4EDUBankInfoStub;
  beforeEach(() => {
    getDD4CNPBankInfoStub = cy.stub();
    getDD4EDUBankInfoStub = cy.stub();
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
      cy.intercept('GET', 'v0/ppiu/payment_information', () => {
        getDD4CNPBankInfoStub();
      });
      cy.intercept('GET', 'v0/profile/ch33_bank_accounts', () => {
        getDD4EDUBankInfoStub();
      });
    });
    it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

      notIDme2FAAlertShown();

      cy.should(() => {
        expect(getDD4CNPBankInfoStub).not.to.be.called;
        expect(getDD4EDUBankInfoStub).not.to.be.called;
      });
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
      cy.intercept('GET', 'v0/ppiu/payment_information', () => {
        getDD4CNPBankInfoStub();
      });
      cy.intercept('GET', 'v0/profile/ch33_bank_accounts', () => {
        getDD4EDUBankInfoStub();
      });
    });
    it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

      notIDme2FAAlertShown();

      cy.should(() => {
        expect(getDD4CNPBankInfoStub).not.to.be.called;
        expect(getDD4EDUBankInfoStub).not.to.be.called;
      });
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
        cy.intercept('GET', 'v0/ppiu/payment_information', () => {
          getDD4CNPBankInfoStub();
        });
        cy.intercept('GET', 'v0/profile/ch33_bank_accounts', () => {
          getDD4EDUBankInfoStub();
        });
      });
      it('should show a single "verify your account" alert and not call direct deposit APIs', () => {
        cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

        notIDme2FAAlertShown();

        cy.should(() => {
          expect(getDD4CNPBankInfoStub).not.to.be.called;
          expect(getDD4EDUBankInfoStub).not.to.be.called;
        });
      });
    },
  );
});
