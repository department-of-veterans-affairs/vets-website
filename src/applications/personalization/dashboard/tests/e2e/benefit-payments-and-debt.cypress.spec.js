/**
 * [TestRail-integrated] Spec for My VA - Benefits Payments & Debt
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 3376
 * @testrailinfo runName MyVA-e2e-PmtsDebt
 */
import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  paymentsError,
  paymentsSuccess,
  paymentsSuccessEmpty,
} from '../fixtures/test-payments-response';
import {
  debtsError,
  debtsSuccess,
  debtsSuccessEmpty,
} from '../fixtures/test-debts-response';
import appointmentsEmpty from '../fixtures/appointments-empty';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - Payments and Debt - when the feature is disabled', () => {
  Cypress.config({ defaultCommandTimeout: 12000 });
  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [],
      },
    });
    mockLocalStorage();
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/evss_claims_async', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('vaos/v0/appointments*', appointmentsEmpty);
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
  });
  it('hides entire Pmts-n-Debts section - C13193', () => {
    cy.visit('my-va/');

    cy.findByTestId('dashboard-section-payment-and-debts').should('not.exist');

    cy.findByTestId('debt-count-alert').should('not.exist');
    cy.findByTestId('manage-va-debt-link').should('not.exist');
    cy.findByTestId('zero-debt-paragraph').should('not.exist');
    cy.findByTestId('debts-error').should('not.exist');

    cy.findByTestId('payment-card').should('not.exist');
    cy.findByTestId('deposit-header').should('not.exist');
    cy.findByTestId('payment-card-view-history-link').should('not.exist');
    cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
    cy.findByTestId('payments-error').should('not.exist');

    cy.findByTestId('view-payment-history-link').should('not.exist');
    cy.findByTestId('manage-direct-deposit-link').should('not.exist');
    cy.findByTestId('learn-va-debt-link').should('not.exist');

    // make the a11y check
    cy.injectAxeThenAxeCheck();
  });
});

describe('The My VA Dashboard - Payments and Debt - when the feature is enabled', () => {
  Cypress.config({ defaultCommandTimeout: 12000 });
  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: featureFlagNames.showPaymentAndDebtSection,
            value: true,
          },
        ],
      },
    });
    mockLocalStorage();
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/evss_claims_async', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('vaos/v0/appointments*', appointmentsEmpty);
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
  });

  describe('and user has no debts', () => {
    beforeEach(() => {
      cy.intercept('/v0/debts', debtsSuccessEmpty()).as('noDebts1');
    });

    describe('and recent payments', () => {
      // Last payment received within past 30 days:
      it('shows Zero-debt-balance & Payment-card - C14319', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
          'recentPayments1',
        );
        cy.visit('my-va/');
        cy.wait(['@noDebts1', '@recentPayments1']);

        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('exist');
        cy.findByTestId('deposit-header').should('exist');
        cy.findByTestId('payment-card-view-history-link').should('exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('learn-va-debt-link').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });

    describe('and old payments', () => {
      // Last payment received > 30 days ago:
      it('shows Zero-debt-balance and No-recent-payments - C14320', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
          'oldPayments1',
        );
        cy.visit('my-va/');
        cy.wait(['@noDebts1', '@oldPayments1']);

        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('view-payment-history-link').should('exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('learn-va-debt-link').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });

    describe('and no payments', () => {
      // No payments received ever:
      /* eslint-disable @department-of-veterans-affairs/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('hides entire Pmts-n-Debts section - C14674', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
          'noPayments1',
        );
        cy.visit('my-va/');
        cy.wait(['@noDebts1', '@noPayments1']);

        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('learn-va-debt-link').should('not.exist');
      });
      /* eslint-enable @department-of-veterans-affairs/axe-check-required */
    });

    describe('and payments-API-error', () => {
      // Payments API returns error:
      it('hides entire section and shows Payments-error only - C14675', () => {
        cy.intercept('/v0/profile/payment_history', paymentsError()).as(
          'paymentsError1',
        );
        cy.visit('my-va/');
        cy.wait(['@noDebts1', '@paymentsError1']);

        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('exist');

        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('learn-va-debt-link').should('not.exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });
  });

  describe('and user has debts', () => {
    beforeEach(() => {
      cy.intercept('/v0/debts', debtsSuccess()).as('debts2');
    });

    describe('and recent payments', () => {
      // Last payment received within past 30 days:
      it('shows Debt-count & Payment-card - C13194', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
          'recentPayments2',
        );
        cy.visit('my-va/');
        cy.wait(['@debts2', '@recentPayments2']);

        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');

        cy.findByTestId('debt-count-alert').should('exist');
        cy.findByTestId('manage-va-debt-link').should('exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('exist');
        cy.findByTestId('deposit-header').should('exist');
        cy.findByTestId('payment-card-view-history-link').should('exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('learn-va-debt-link').should('not.exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });
    describe('and old payments', () => {
      // Last payment received > 30 days ago:
      it('shows Debt-count and No-recent-payments - C13195', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
          'oldPayments2',
        );
        cy.visit('my-va/');
        cy.wait(['@debts2', '@oldPayments2']);

        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');

        cy.findByTestId('debt-count-alert').should('exist');
        cy.findByTestId('manage-va-debt-link').should('exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('view-payment-history-link').should('exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('learn-va-debt-link').should('not.exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });

    describe('and no payments', () => {
      // No payments received ever:
      /* eslint-disable @department-of-veterans-affairs/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('hides entire Pmts-n-Debts section - C14195', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
          'noPayments2',
        );
        cy.visit('my-va/');
        cy.wait(['@debts2', '@noPayments2']);

        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('learn-va-debt-link').should('not.exist');
      });
      /* eslint-enable @department-of-veterans-affairs/axe-check-required */
    });

    describe('and payments-API-error', () => {
      // Payments API returns error:
      /* eslint-disable @department-of-veterans-affairs/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('hides entire section and shows Payments-error only - C14391', () => {
        cy.intercept('/v0/profile/payment_history', paymentsError()).as(
          'paymentsError2',
        );
        cy.visit('my-va/');
        cy.wait(['@debts2', '@paymentsError2']);

        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('exist');

        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('learn-va-debt-link').should('not.exist');
      });
      /* eslint-enable @department-of-veterans-affairs/axe-check-required */
    });
  });

  describe('and User has debts-API-error', () => {
    beforeEach(() => {
      cy.intercept('/v0/debts', debtsError()).as('debtsError3');
    });

    describe('and recent payments', () => {
      // Last payment received within last 30 days:
      it('shows Debts-error & Payment-card - C14676', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
          'recentPayments3',
        );
        cy.visit('my-va/');
        cy.wait(['@debtsError3', '@recentPayments3']);

        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('exist');

        cy.findByTestId('payment-card').should('exist');
        cy.findByTestId('deposit-header').should('exist');
        cy.findByTestId('payment-card-view-history-link').should('exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('learn-va-debt-link').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });

    describe('and old payments', () => {
      // Last payment received > 30 days ago:
      it('shows Debts-error and No-recent-payments - C14390', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
          'oldPayments3',
        );
        cy.visit('my-va/');
        cy.wait(['@debtsError3', '@oldPayments3']);

        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('exist');

        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('view-payment-history-link').should('exist');
        cy.findByTestId('learn-va-debt-link').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });

    describe('and no payments', () => {
      // No payments received ever.
      /* eslint-disable @department-of-veterans-affairs/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('hides entire Pmts-n-Debts section and shows no error - C14677', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
          'noPayments3',
        );
        cy.visit('my-va/');
        cy.wait(['@debtsError3', '@noPayments3']);

        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('not.exist');

        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('learn-va-debt-link').should('not.exist');
      });
      /* eslint-enable @department-of-veterans-affairs/axe-check-required */
    });

    describe('and payments-API-error', () => {
      // Payments API returns error.
      /* eslint-disable @department-of-veterans-affairs/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('hides entire section and shows Payments-error only - C14392', () => {
        cy.intercept('/v0/profile/payment_history', paymentsError()).as(
          'paymentsError3',
        );
        cy.visit('my-va/');
        cy.wait(['@debtsError3', '@paymentsError3']);

        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );

        cy.findByTestId('debt-count-alert').should('not.exist');
        cy.findByTestId('manage-va-debt-link').should('not.exist');
        cy.findByTestId('zero-debt-paragraph').should('not.exist');
        cy.findByTestId('debts-error').should('not.exist');

        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('deposit-header').should('not.exist');
        cy.findByTestId('payment-card-view-history-link').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('payments-error').should('exist');

        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('view-payment-history-link').should('not.exist');
        cy.findByTestId('learn-va-debt-link').should('not.exist');
      });
      /* eslint-enable @department-of-veterans-affairs/axe-check-required */
    });
  });
});
