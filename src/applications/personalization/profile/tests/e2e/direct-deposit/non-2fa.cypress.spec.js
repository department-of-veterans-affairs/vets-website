import { PROFILE_PATHS } from '@@profile/constants';

import mockUser from '@@profile/tests/fixtures/users/user-non-2fa.json';

function confirmSetUp2FAAlertIsShown() {
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
  it('should show a single "set up 2-factor authentication" alert to non-2FA users', () => {
    cy.intercept('GET', 'v0/user', mockUser);
    cy.intercept('GET', 'v0/ppiu/payment_information', () => {
      getDD4CNPBankInfoStub();
    });
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', () => {
      getDD4EDUBankInfoStub();
    });
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

    // confirm the 2FA alert is shown
    confirmSetUp2FAAlertIsShown();

    cy.should(() => {
      expect(getDD4CNPBankInfoStub).not.to.be.called;
      expect(getDD4EDUBankInfoStub).not.to.be.called;
    });
  });
});
