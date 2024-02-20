import { PROFILE_PATHS } from '@@profile/constants';

import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import mockUserInEVSS from '@@profile/tests/fixtures/users/user-36.json';
import mockDD4EDUEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-enrolled.json';
import { mockFeatureToggles } from '../helpers';

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
    .findByLabelText(TEST_ACCOUNT.TYPE)
    .click({ force: true });
}

function dismissUnsavedChangesModal() {
  cy.axeCheck();
  cy.get('va-modal')
    .shadow()
    .find('.va-modal-close')
    .click();
}

function exitBankInfoForm(type) {
  cy.get(`[data-testid="${type}-form-cancel-button"]`).click();
}

function saveNewBankInfo(id) {
  if (!id) {
    cy.findByRole('button', { name: /save/i }).click({ force: true });
  } else {
    cy.findByTestId(`${id}-bank-info-form`)
      .findByRole('button', { name: /save/i })
      .click();
  }
  cy.axeCheck();
}

function saveErrorExists() {
  cy.findByText(/We couldn’t update your payment information./i).should(
    'exist',
  );
}

function saveSuccessAlertShown() {
  cy.axeCheck();
  cy.findByTestId('bankInfoUpdateSuccessAlert').contains(
    new RegExp(`Update saved`, 'i'),
  );
}

function saveSuccessAlertRemoved() {
  cy.findByTestId('bankInfoUpdateSuccessAlert').should('not.exist');
}

describe('Direct Deposit', () => {
  beforeEach(() => {
    cy.login(mockUserInEVSS);
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits/disability_compensations',
      mockDisabilityCompensations.isEligible,
    );
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    mockFeatureToggles();
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
    cy.injectAxe();
  });
  describe('for CNP', () => {
    it('should allow bank info updates, and show error', () => {
      cy.axeCheck();
      cy.findByRole('button', {
        name: /edit.*disability.*bank information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.get('#disability-compensation-and-pension-benefits').should(
        'be.focused',
      );
      fillInBankInfoForm('CNP');
      exitBankInfoForm('CNP');
      dismissUnsavedChangesModal();
      saveNewBankInfo();
      // the save will fail since we didn't mock the update endpoint yet
      saveErrorExists();
    });
    it('should successfully update bank info', () => {
      cy.intercept(
        'PUT',
        'v0/profile/direct_deposits/disability_compensations',
        mockDisabilityCompensations.base,
      ).as('updateBankInfoSuccess');
      cy.axeCheck();
      cy.findByRole('button', {
        name: /edit.*disability.*bank information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.get('#disability-compensation-and-pension-benefits').should(
        'be.focused',
      );
      fillInBankInfoForm('CNP');
      exitBankInfoForm('CNP');
      dismissUnsavedChangesModal();
      saveNewBankInfo();
      cy.wait('@updateBankInfoSuccess');
      cy.findByRole('button', {
        name: /edit.*disability.*pension.*bank info/i,
      }).should('exist');
      cy.findByRole('button', { name: /edit.*bank information/i }).should(
        'not.exist',
      );
      saveSuccessAlertShown();
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
      cy.get('#education-benefits').should('be.focused');
      fillInBankInfoForm('EDU');
      exitBankInfoForm('EDU');
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
      saveSuccessAlertShown();
      saveSuccessAlertRemoved();
      cy.axeCheck();
    });
  });
  describe('when editing both at the same time and they both fail to update', () => {
    it('should not have any aXe violations', () => {
      cy.findByRole('button', {
        name: /edit.*disability.*bank information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.findByRole('button', {
        name: /edit.*education.*bank info/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      fillInBankInfoForm('CNP');
      fillInBankInfoForm('EDU');
      saveNewBankInfo('CNP');
      saveNewBankInfo('EDU');
      // This scan will be run while the bank info is saving and the
      // LoadingButton is in its "loading" state. This would throw an aXe error
      // if LoadingButton.loadingText was not set
      cy.axeCheck();
      // Now wait for the update API calls to resolve to failures...
      cy.findAllByText(/We couldn’t update your payment information./i).should(
        'have.length',
        '2',
      );
      cy.axeCheck();
    });
  });
  describe('when moving to other profile sections', () => {
    it('should exit edit mode if opened', () => {
      cy.findByRole('button', {
        name: /edit.*disability.*bank information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.findByRole('link', {
        name: /military information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.findByRole('link', {
        name: /direct deposit information/i,
      }).click({
        // using force: true since there are times when the click does not
        // register and the bank info form does not open
        force: true,
      });
      cy.findByRole('button', {
        name: /edit.*disability.*bank info/i,
      }).should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
