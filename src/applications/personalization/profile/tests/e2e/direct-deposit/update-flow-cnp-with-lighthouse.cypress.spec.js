import { PROFILE_PATHS } from '@@profile/constants';

import mockUserInEVSS from '@@profile/tests/fixtures/users/user-36.json';
import mockDD4EDUEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-enrolled.json';
import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';

import { mockGETEndpoints } from '../helpers';

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
  error = mockDisabilityCompensations.updates.errors.unspecified,
  alias = 'unspecifiedSaveError',
} = {}) {
  cy.intercept('PUT', 'v0/profile/direct_deposits/disability_compensations', {
    statusCode: 400,
    body: error,
  }).as(alias);
  return alias;
}

function mockSaveSuccess() {
  cy.intercept(
    'PUT',
    'v0/profile/direct_deposits/disability_compensations',
    mockDisabilityCompensations.updates.success,
  ).as('saveSuccess');
}

const testFailure = (failureName, error) => {
  it(`shows error messaging for ${failureName}`, () => {
    const failAlias = mockSaveError({
      error,
      alias: failureName,
    });

    cy.findByRole('button', {
      name: /edit.*disability.*bank information/i,
    }).click({
      force: true,
    });

    fillInBankInfoForm('CNP');

    saveNewBankInfo();

    cy.wait(`@${failAlias}`);

    cy.findByTestId(failureName).should('exist');

    cy.axeCheck();
  });
};

describe('Direct Deposit - CNP using Lighthouse endpoint', () => {
  beforeEach(() => {
    cy.login(mockUserInEVSS);
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
      'v0/profile/direct_deposits/disability_compensations',
      mockDisabilityCompensations.base,
    ).as('getCNPFromLighthouse');
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.intercept(
      'GET',
      'v0/feature_toggles?*',
      generateFeatureToggles({
        profileLighthouseDirectDeposit: true,
      }),
    );
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
    cy.wait(['@getCNPFromLighthouse']);
    cy.injectAxeThenAxeCheck();
  });
  describe('happy path', () => {
    it('should allow bank info updates, show WIP warning modals, show "success" banner', () => {
      mockSaveSuccess();

      cy.findByRole('button', {
        name: /edit.*disability.*bank information/i,
      }).click({
        force: true,
      });

      cy.get('#disability-compensation-and-pension-benefits').should(
        'be.focused',
      );

      fillInBankInfoForm('CNP');

      exitBankInfoForm('CNP');

      dismissUnsavedChangesModal();

      saveNewBankInfo();

      cy.findByRole('button', {
        name: /edit.*disability.*pension.*bank info/i,
      }).should('exist');

      saveSuccessAlertShown();

      saveSuccessAlertRemoved();

      cy.axeCheck();
    });
  });

  describe('sad update paths for error responses', () => {
    testFailure(
      'generic-error',
      mockDisabilityCompensations.updates.errors.unspecified,
    );

    testFailure(
      'flagged-account-error',
      mockDisabilityCompensations.updates.errors.accountNumberFlagged,
    );

    testFailure(
      'flagged-routing-number-error',
      mockDisabilityCompensations.updates.errors.routingNumberFlagged,
    );

    testFailure(
      'invalid-routing-number-error',
      mockDisabilityCompensations.updates.errors.invalidRoutingNumber,
    );
  });
});
