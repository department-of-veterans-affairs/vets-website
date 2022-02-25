/**
 * [TestRail-integrated] Spec for My VA - Benefits Payments & Debt
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 3376
 * @testrailinfo runName MyVA-e2e-PmtsDebt
 */
import { mockUser } from '@@profile/tests/fixtures/users/user.js';
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
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - Payments and Debt', () => {
  describe('when the feature is disabled', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
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
      cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
    });
    it('the payment and debt section does not show up - C13193', () => {
      // Feature disabled:
      // hides entire section.
      cy.visit('my-va/');

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

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('when the feature is enabled', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
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
      cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
    });

    context('and user has no debts', () => {
      beforeEach(() => {
        cy.intercept('/v0/debts', debtsSuccessEmpty());
      });

      it('and recent payments', () => {
        // Last payment received within past 30 days:
        // shows Zero-debt-balance & Payment-card.
        cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
          'recentPayments0',
        );
        cy.visit('my-va/');
        cy.wait('@recentPayments0');

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

      it('and old payments - C14320', () => {
        // Last payment received > 30 days ago:
        // shows Zero-debt-balance and No-recent-payments.
        cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
          'oldPayments0',
        );
        cy.visit('my-va/');
        cy.wait('@oldPayments0');

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

      /* eslint-disable va/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('and no payments', () => {
        // No payments received ever:
        // hides entire Pmts-n-Debts section.
        cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
          'noPayments0',
        );
        cy.visit('my-va/');
        cy.wait('@noPayments0');

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
      /* eslint-enable va/axe-check-required */

      it('and payments-API-error', () => {
        // Payments API returns error:
        // hides entire section and shows Payments-error only.
        cy.intercept('/v0/profile/payment_history', paymentsError()).as(
          'paymentsError0',
        );
        cy.visit('my-va/');
        cy.wait('@paymentsError0');

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

    context('and user has debts', () => {
      beforeEach(() => {
        cy.intercept('/v0/debts', debtsSuccess());
      });

      it('and recent payments - C13194', () => {
        // Last payment received within past 30 days:
        // shows Debt-count & Payment-card.
        cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
          'recentPayments1',
        );
        cy.visit('my-va/');
        cy.wait('@recentPayments1');

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

      it('and old payments - C13195', () => {
        // Last payment received > 30 days ago:
        // shows Debt-count and No-recent-payments.
        cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
          'oldPayments1',
        );
        cy.visit('my-va/');
        cy.wait('@oldPayments1');

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

      /* eslint-disable va/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('and no payments - C14195', () => {
        // No payments received ever:
        // hides entire Pmts-n-Debts section.
        cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
          'noPayments1',
        );
        cy.visit('my-va/');
        cy.wait('@noPayments1');

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
      /* eslint-enable va/axe-check-required */

      /* eslint-disable va/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('and payments-API-error - C14391', () => {
        // Payments API returns error:
        // hides entire section and shows Payments-error only.
        cy.intercept('/v0/profile/payment_history', paymentsError()).as(
          'paymentsError0',
        );
        cy.visit('my-va/');
        cy.wait('@paymentsError0');

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
      /* eslint-enable va/axe-check-required */
    });

    context('and User has debts-API-error', () => {
      beforeEach(() => {
        cy.intercept('/v0/debts', debtsError());
      });

      it('and recent payments', () => {
        // Last payment received within last 30 days:
        // shows Debts-error & Payment-card.
        cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
          'recentPayments2',
        );
        cy.visit('my-va/');
        cy.wait('@recentPayments2');

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

      it('and old payments - C14390', () => {
        // Last payment received > 30 days ago:
        // shows Debts-error and No-recent-payments.
        cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
          'oldPayments2',
        );
        cy.visit('my-va/');
        cy.wait('@oldPayments2');

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

      /* eslint-disable va/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('and no payments', () => {
        // No payments received ever:
        // hides entire Pmts-n-Debts section and shows no error.
        cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
          'noPayments2',
        );
        cy.visit('my-va/');
        cy.wait('@noPayments2');

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
      /* eslint-enable va/axe-check-required */

      /* eslint-disable va/axe-check-required */
      // Same display state as a previous test with AXE-check.
      it('and payments-API-error - C14392', () => {
        // Payments API returns error:
        // hides entire section and shows Payments-error only.
        cy.intercept('/v0/profile/payment_history', paymentsError()).as(
          'paymentsError2',
        );
        cy.visit('my-va/');
        cy.wait('@paymentsError2');

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
      /* eslint-enable va/axe-check-required */
    });
  });
});
