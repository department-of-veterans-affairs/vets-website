import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS } from '@@profile/constants';

import mockUserInEVSS from '@@profile/tests/fixtures/users/user-36.json';
import mockDD4CNPNotEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-set-up.json';
import mockDD4CNPEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-set-up.json';
import mockDD4EDUEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-enrolled.json';

// this entire test file can be removed when DD4EDU is on prod to 100% of users
const dd4eduDisabled = {
  data: {
    type: 'feature_toggles',
    features: [
      {
        name: 'ch33_dd_profile',
        value: false,
      },
    ],
  },
};

function fillInBankInfoForm() {
  cy.axeCheck();
  cy.findByLabelText(/routing number/i).type('123123123');
  cy.findByLabelText(/account number/i).type('123123123');
  cy.findByLabelText(/type/i).select('Checking');
}

function dismissUnsavedChangesModal() {
  cy.axeCheck();
  cy.findByText(/are you sure\?/i);
  cy.findByRole('button', { name: /close this modal/i }).click();
}

function exitBankInfoForm() {
  cy.findByRole('button', { name: /cancel/i }).click();
}

function saveNewBankInfo() {
  cy.findByRole('button', { name: /update/i }).click();
}

function saveErrorExists() {
  cy.findByText(/we couldn’t update your bank info/i).should('exist');
}

function saveSuccessAlertShown() {
  cy.axeCheck();
  cy.findByTestId('bankInfoUpdateSuccessAlert').contains(
    new RegExp(
      `we.*updated your.*account info.*compensation and pension benefits`,
      'i',
    ),
  );
}

function saveSuccessAlertRemoved() {
  cy.findByTestId('bankInfoUpdateSuccessAlert').should('not.exist');
}

describe('Direct Deposit', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login(mockUserInEVSS);
    cy.intercept('/v0/feature_toggles*', dd4eduDisabled);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPNotEnrolled);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
    cy.injectAxe();
  });
  it('should allow bank info updates, show WIP warning modals, show "update successful" banners, etc.', () => {
    cy.axeCheck();
    cy.findByRole('button', { name: /add.*bank info/i }).click({
      // using force: true since there are times when the click does not
      // register and the bank info form does not open
      force: true,
    });
    fillInBankInfoForm();
    exitBankInfoForm();
    dismissUnsavedChangesModal();
    saveNewBankInfo();
    // the save will fail since we didn't mock the update endpoint yet
    saveErrorExists();
    // TODO: can I make this mock smarter so that it inspects the PUT payload
    // and I can confirm that the correct data is sent to it? We really just
    // need to make sure that the routingNumber, accountNumber, and
    // accountType are not null
    cy.intercept('PUT', 'v0/ppiu/payment_information', mockDD4CNPEnrolled);
    saveNewBankInfo();
    cy.findByRole('button', {
      name: /edit.*disability.*pension.*bank info/i,
    }).should('exist');
    cy.findByRole('button', { name: /add.*bank info/i }).should('not.exist');
    saveSuccessAlertShown();
    saveSuccessAlertRemoved();
    cy.axeCheck();
  });
});
