import { PROFILE_PATHS } from '@@profile/constants';

import mockUserInEVSS from '@@profile/tests/fixtures/users/user-36.json';
import mockDD4CNPNotEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-set-up.json';
import mockDD4CNPEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-set-up.json';
import mockDD4EDUEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-enrolled.json';

const TEST_ACCOUNT = {
  NUMBER: '123123123',
  ROUTING: '321321321',
  TYPE: 'Checking',
};

function fillInBankInfoForm(id) {
  cy.axeCheck();
  cy.findByTestId(`${id}-bank-info-form`)
    .findByLabelText(/routing number/i)
    .type(TEST_ACCOUNT.ROUTING);
  cy.findByTestId(`${id}-bank-info-form`)
    .findByLabelText(/account number/i)
    .type(TEST_ACCOUNT.NUMBER);
  cy.findByTestId(`${id}-bank-info-form`)
    .findByLabelText(/type/i)
    .select(TEST_ACCOUNT.TYPE);
}

function dismissUnsavedChangesModal() {
  cy.axeCheck();
  cy.findByText(/are you sure\?/i);
  cy.findByRole('button', { name: /close the warning modal/i }).click();
}

function exitBankInfoForm() {
  cy.findByRole('button', { name: /cancel/i }).click();
}

function saveNewBankInfo(id) {
  if (!id) {
    cy.findByRole('button', { name: /update/i }).click({ force: true });
  } else {
    cy.findByTestId(`${id}-bank-info-form`)
      .findByRole('button', { name: /update/i })
      .click();
  }
  cy.axeCheck();
}

function saveErrorExists() {
  cy.findByText(/we couldn’t update your bank info/i).should('exist');
}

function saveSuccessAlertShown(contents) {
  cy.axeCheck();
  cy.findByTestId('bankInfoUpdateSuccessAlert').contains(
    new RegExp(`we.*updated your.*account info.*${contents}`, 'i'),
  );
}

function saveSuccessAlertRemoved() {
  cy.findByTestId('bankInfoUpdateSuccessAlert').should('not.exist');
}

describe('Direct Deposit', () => {
  beforeEach(() => {
    cy.login(mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPNotEnrolled);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
    cy.injectAxe();
  });
  describe('for CNP', () => {
    it('should allow bank info updates, show WIP warning modals, show "update successful" banners, etc.', () => {
      cy.axeCheck();
      cy.findByRole('button', {
        name: /edit.*disability.*bank information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.findByLabelText(/routing number/i).should('be.focused');
      fillInBankInfoForm('CNP');
      exitBankInfoForm();
      dismissUnsavedChangesModal();
      saveNewBankInfo();
      // the save will fail since we didn't mock the update endpoint yet
      saveErrorExists();
      cy.intercept('PUT', 'v0/ppiu/payment_information', req => {
        // only return a successful response if the API payload includes data
        // that was entered into the edit form
        const {
          accountNumber,
          financialInstitutionRoutingNumber,
          accountType,
        } = req.body;
        const { NUMBER, ROUTING, TYPE } = TEST_ACCOUNT;
        if (
          accountNumber === NUMBER &&
          financialInstitutionRoutingNumber === ROUTING &&
          accountType === TYPE
        ) {
          req.reply(mockDD4CNPEnrolled);
        }
      });
      saveNewBankInfo();
      cy.findByRole('button', {
        name: /edit.*disability.*pension.*bank info/i,
      }).should('exist');
      cy.findByRole('button', { name: /edit.*bank information/i }).should(
        'not.exist',
      );
      saveSuccessAlertShown('compensation and pension benefits');
      saveSuccessAlertRemoved();
      cy.axeCheck();
    });
  });
  describe('for EDU', () => {
    it('should allow bank info updates, show WIP warning modals, show "update successful" banners, etc.', () => {
      cy.axeCheck();
      cy.findByRole('button', {
        name: /edit.*education.*bank info/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.findByLabelText(/routing number/i).should('be.focused');
      fillInBankInfoForm('EDU');
      exitBankInfoForm();
      dismissUnsavedChangesModal();
      saveNewBankInfo();
      // the save will fail since we didn't mock the update endpoint yet
      saveErrorExists();
      cy.intercept('PUT', 'v0/profile/ch33_bank_accounts', req => {
        // only return a successful response if the API payload includes data
        // that was entered into the edit form
        const {
          accountNumber,
          financialInstitutionRoutingNumber,
          accountType,
        } = req.body;
        const { NUMBER, ROUTING, TYPE } = TEST_ACCOUNT;
        if (
          accountNumber === NUMBER &&
          financialInstitutionRoutingNumber === ROUTING &&
          accountType === TYPE
        ) {
          req.reply(mockDD4EDUEnrolled);
        }
      });
      saveNewBankInfo();
      cy.findByRole('button', {
        name: /edit.*education.*bank info/i,
      }).should('exist');
      saveSuccessAlertShown('education benefits');
      saveSuccessAlertRemoved();
      cy.axeCheck();
    });
  });
  describe('when trying to open both modals', () => {
    it('should show a warning', () => {
      cy.findByRole('button', {
        name: /edit.*disability.*bank information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      fillInBankInfoForm('CNP');
      cy.findByRole('button', {
        name: /edit.*education.*bank info/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      // test dismiss
      dismissUnsavedChangesModal();
      cy.findByTestId(`EDU-bank-info-form`).should('not.exist');
      cy.findByTestId(`CNP-bank-info-form`).should('exist');
      cy.findByRole('button', {
        name: /edit.*education.*bank info/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      // test toggle from cnp to edu
      cy.findByText(/are you sure\?/i);
      cy.findByRole('button', { name: /cancel/i }).click();
      cy.findByTestId(`EDU-bank-info-form`).should('exist');
      cy.findByTestId(`CNP-bank-info-form`).should('not.exist');
      // test toggle from edu to cnp
      cy.findByRole('button', {
        name: /edit.*disability.*bank information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.findByText(/are you sure\?/i);
      cy.findByRole('button', { name: /cancel/i }).click();
      cy.findByTestId(`EDU-bank-info-form`).should('not.exist');
      cy.findByTestId(`CNP-bank-info-form`).should('exist');
    });
  });
});
