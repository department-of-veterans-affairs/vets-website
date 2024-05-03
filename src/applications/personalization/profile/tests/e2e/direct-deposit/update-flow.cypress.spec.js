import { PROFILE_PATHS } from '@@profile/constants';

import mockUser36 from '@@profile/tests/fixtures/users/user-36.json';
import mockDirectDeposits from '@@profile/mocks/endpoints/direct-deposits';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';

import { mockGETEndpoints } from '../helpers';

const TEST_ACCOUNT = {
  NUMBER: '123123123',
  ROUTING: '321321321',
  TYPE: 'Checking',
};

function fillInBankInfoForm() {
  cy.axeCheck();
  cy.get('va-text-input[name="root_routingNumber"]')
    .shadow()
    .find('input')
    .type(TEST_ACCOUNT.ROUTING);
  cy.get('va-text-input[name="root_accountNumber"]')
    .shadow()
    .find('input')
    .type(TEST_ACCOUNT.NUMBER);
  cy.get('va-radio-option[value="Checking"]')
    .find('#root_accountTypeCheckinginput')
    .click({ force: true });
}

function dismissUnsavedChangesModal() {
  cy.axeCheck();
  cy.get('va-modal')
    .shadow()
    .find('.va-modal-close')
    .click();
}

function cancelChangesViaModal() {
  cy.axeCheck();
  cy.get('va-modal')
    .shadow()
    .find('.usa-button-group__item')
    .first()
    .find('va-button')
    .click();
}

function exitBankInfoForm() {
  cy.findByTestId('cancel-direct-deposit')
    .shadow()
    .find('button')
    .click();
}

function saveNewBankInfo() {
  cy.findByRole('button', { name: /save/i }).click({ force: true });
  cy.axeCheck();
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

function mockSaveError({
  error = mockDirectDeposits.updates.errors.unspecified,
  alias = 'unspecifiedSaveError',
} = {}) {
  cy.intercept('PUT', 'v0/profile/direct_deposits', {
    statusCode: 400,
    body: error,
  }).as(alias);
  return alias;
}

function mockSaveSuccess() {
  cy.intercept(
    'PUT',
    'v0/profile/direct_deposits',
    mockDirectDeposits.updates.success,
  ).as('saveSuccess');
}

const testFailure = (failureName, error) => {
  it(`shows error messaging for ${failureName}`, () => {
    const failAlias = mockSaveError({
      error,
      alias: failureName,
    });

    cy.findByTestId('edit-bank-info-button')
      .shadow()
      .find('button')
      .click({
        force: true,
      });

    fillInBankInfoForm();

    saveNewBankInfo();

    cy.wait(`@${failAlias}`);

    cy.findByTestId(failureName).should('exist');

    cy.axeCheck();
  });
};

describe('Direct Deposit - CNP using Lighthouse endpoint', () => {
  beforeEach(() => {
    cy.login(mockUser36);
    mockGETEndpoints(
      [
        '/v0/disability_compensation_form/rating_info',
        '/v0/user_transition_availabilities',
        'v0/profile/personal_information',
        'v0/profile/service_history',
        'v0/profile/full_name',
      ],
      200,
      {},
    );
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      mockDirectDeposits.base,
    ).as('getDirectDeposit');
    cy.intercept(
      'GET',
      'v0/feature_toggles?*',
      generateFeatureToggles({
        profileShowDirectDepositSingleForm: true,
      }),
    );
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
    cy.wait(['@getDirectDeposit']);
    cy.injectAxeThenAxeCheck();
  });
  describe('happy path', () => {
    it('should allow bank info updates, show WIP warning modals, show "success" banner', () => {
      mockSaveSuccess();

      cy.findByTestId('edit-bank-info-button')
        .shadow()
        .find('button')
        .click({
          force: true,
        });

      cy.get('#bank-account-information').should('be.focused');

      fillInBankInfoForm();

      exitBankInfoForm();

      dismissUnsavedChangesModal();

      saveNewBankInfo();

      cy.findByTestId('edit-bank-info-button')
        .shadow()
        .find('button')
        .should('exist');

      saveSuccessAlertShown();

      saveSuccessAlertRemoved();

      cy.axeCheck();
    });

    it('should focus on edit button after successful update', () => {
      mockSaveSuccess();

      cy.findByTestId('edit-bank-info-button')
        .shadow()
        .find('button')
        .click({
          force: true,
        });

      fillInBankInfoForm();

      saveNewBankInfo();

      cy.wait('@saveSuccess');

      cy.findByTestId('edit-bank-info-button')
        .shadow()
        .find('button')
        .should('be.focused');

      cy.axeCheck();
    });

    it('should focus on edit button after cancelling update view with pending changes', () => {
      mockSaveSuccess();

      cy.findByTestId('edit-bank-info-button')
        .shadow()
        .find('button')
        .click({
          force: true,
        });

      fillInBankInfoForm();

      exitBankInfoForm();

      cancelChangesViaModal();

      cy.findByTestId('edit-bank-info-button')
        .shadow()
        .find('button')
        .should('be.focused');

      cy.axeCheck();
    });
  });

  describe('sad update paths for error responses', () => {
    testFailure('generic-error', mockDirectDeposits.updates.errors.unspecified);

    testFailure(
      'flagged-account-error',
      mockDirectDeposits.updates.errors.accountNumberFlagged,
    );

    testFailure(
      'flagged-routing-number-error',
      mockDirectDeposits.updates.errors.routingNumberFlagged,
    );

    testFailure(
      'invalid-routing-number-error',
      mockDirectDeposits.updates.errors.invalidRoutingNumber,
    );
  });
});
