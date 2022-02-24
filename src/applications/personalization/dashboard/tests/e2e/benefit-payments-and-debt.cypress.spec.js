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
      cy.visit('my-va/');
    });
    it('the payment and debt section does not show up - C13193', () => {
      // make sure that the Payment and Debt section is not shown
      cy.findByTestId('dashboard-section-payment-and-debts').should(
        'not.exist',
      );
      cy.findByTestId('deposit-header').should('not.exist');
      cy.findByTestId('payment-card').should('not.exist');
      cy.findByTestId('manage-direct-deposit-link').should('not.exist');

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

      context('and recent payments', () => {
        // Last payment received within last 30 days.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
            'recentPayments0',
          );
        });
        it('shows Zero-debt-balance & Payment-card', () => {
          cy.visit('my-va/');
          cy.wait('@recentPayments0');
          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'exist',
          );
          cy.findByTestId('zero-debt-paragraph').should('exist');
          cy.findByTestId('payment-card').should('exist');
          cy.findByTestId('deposit-header').should('exist');
          cy.findByTestId('payment-card-view-history-link').should('exist');
          cy.findByTestId('manage-direct-deposit-link').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      context('and old payments', () => {
        // Last payment received > 30 days ago.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
            'oldPayments0',
          );
        });
        it('shows Zero-debt-balance and No-recent-payments - C14320', () => {
          cy.visit('my-va/');
          cy.wait('@oldPayments0');
          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'exist',
          );
          cy.findByTestId('zero-debt-paragraph').should('exist');
          cy.findByTestId('payment-card').should('not.exist');
          cy.findByTestId('no-recent-payments-paragraph').should('exist');
          cy.findByTestId('manage-direct-deposit-link').should('exist');
          cy.findByTestId('view-payment-history-link').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      context('and no payments', () => {
        // No payments received ever.
        beforeEach(() => {
          cy.intercept(
            '/v0/profile/payment_history',
            paymentsSuccessEmpty(),
          ).as('noPayments0');
        });
        /* eslint-disable va/axe-check-required */
        // Same display state as a previous test with AXE-check.
        it('hides entire Pmts-n-Debts section', () => {
          cy.visit('my-va/');
          cy.wait('@noPayments0');
          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'not.exist',
          );
          cy.findByTestId('deposit-header').should('not.exist');
          cy.findByTestId('payment-card').should('not.exist');
          cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        });
        /* eslint-enable va/axe-check-required */
      });

      context('and payments-API-error', () => {
        // Payments API returns error.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsError()).as(
            'paymentsError0',
          );
        });
        it('hides entire section and shows Payments-error only', () => {
          cy.visit('my-va/');
          cy.wait('@paymentsError0');
          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'not.exist',
          );
          cy.findByTestId('manage-direct-deposit-link').should('not.exist');
          cy.findByTestId('view-payment-history-link').should('not.exist');
          cy.findByTestId('payments-error').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });
    });

    context('and user has debts', () => {
      beforeEach(() => {
        cy.intercept('/v0/debts', debtsSuccess());
      });

      context('and recent payments', () => {
        // Last payment received within last 30 days.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
            'recentPayments1',
          );
        });
        it('shows Debt-count & Payment-card', () => {
          cy.visit('my-va/');
          cy.wait('@recentPayments1');
          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'exist',
          );
          cy.findByTestId('debt-count-alert').should('exist');
          cy.findByTestId('manage-va-debt-link').should('exist');
          cy.findByTestId('payment-card').should('exist');
          cy.findByTestId('deposit-header').should('exist');
          cy.findByTestId('payment-card-view-history-link').should('exist');
          cy.findByTestId('manage-direct-deposit-link').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      context('and old payments', () => {
        // Last payment received > 30 days ago.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
            'oldPayments1',
          );
        });
        it('shows Debt-count and No-recent-payments', () => {
          cy.visit('my-va/');
          cy.wait('@oldPayments1');
          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'exist',
          );
          cy.findByTestId('debt-count-alert').should('exist');
          cy.findByTestId('manage-va-debt-link').should('exist');
          cy.findByTestId('payment-card').should('not.exist');
          cy.findByTestId('no-recent-payments-paragraph').should('exist');
          cy.findByTestId('manage-direct-deposit-link').should('exist');
          cy.findByTestId('view-payment-history-link').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      context('and no payments', () => {
        // No payments received ever.
        beforeEach(() => {
          cy.intercept(
            '/v0/profile/payment_history',
            paymentsSuccessEmpty(),
          ).as('noPayments1');
        });
        /* eslint-disable va/axe-check-required */
        // Same display state as a previous test with AXE-check.
        it('hides entire Pmts-n-Debts section', () => {
          cy.visit('my-va/');
          cy.wait('@noPayments1');
          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'not.exist',
          );
          cy.findByTestId('deposit-header').should('not.exist');
          cy.findByTestId('payment-card').should('not.exist');
          cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        });
        /* eslint-enable va/axe-check-required */
      });

      context('and payments-API-error', () => {
        // Payments API returns error.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsError()).as(
            'paymentsError0',
          );
        });
        /* eslint-disable va/axe-check-required */
        // Same display state as a previous test with AXE-check.
        it('hides entire section and shows Payments-error only', () => {
          cy.visit('my-va/');
          cy.wait('@paymentsError0');
          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'not.exist',
          );
          cy.findByTestId('manage-direct-deposit-link').should('not.exist');
          cy.findByTestId('view-payment-history-link').should('not.exist');
          cy.findByTestId('payments-error').should('exist');
        });
        /* eslint-enable va/axe-check-required */
      });
    });

    context('and User has debs-API-error', () => {
      beforeEach(() => {
        cy.intercept('/v0/debts', debtsError());
      });

      context('and recent payments', () => {
        // Last payment received within last 30 days.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
            'recentPayments2',
          );
        });
        it('shows Debts-error & Payment-card', () => {
          cy.visit('my-va/');
          cy.wait('@recentPayments2');

          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'exist',
          );
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

      context('and old payments', () => {
        // Last payment received > 30 days ago.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
            'oldPayments2',
          );
        });
        it('shows Debts-error and No-recent-payments', () => {
          cy.visit('my-va/');
          cy.wait('@oldPayments2');

          cy.findByTestId('dashboard-section-payment-and-debts').should(
            'exist',
          );

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

      context('and no payments', () => {
        // No payments received ever.
        beforeEach(() => {
          cy.intercept(
            '/v0/profile/payment_history',
            paymentsSuccessEmpty(),
          ).as('noPayments2');
        });
        /* eslint-disable va/axe-check-required */
        // Same display state as a previous test with AXE-check.
        it('hides entire Pmts-n-Debts section and shows no error', () => {
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
      });

      context('and payments-API-error', () => {
        // Payments API returns error.
        beforeEach(() => {
          cy.intercept('/v0/profile/payment_history', paymentsError()).as(
            'paymentsError2',
          );
        });
        /* eslint-disable va/axe-check-required */
        // Same display state as a previous test with AXE-check.
        it('hides entire section and shows Payments-error only', () => {
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

    context.skip('and user has payments', () => {
      beforeEach(() => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess(true));
        cy.intercept('/v0/debts', debtsSuccess());
      });
      it('and they have payments in the last 30 days - C13194', () => {
        // make sure that the Payment and Debt section is shown
        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');
        cy.findByTestId('payment-card').should('exist');
        cy.findByTestId('deposit-header').should('exist');
        cy.findByTestId('payment-card-view-history-link').should('exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });

    context.skip('and user has no payments', () => {
      beforeEach(() => {
        cy.visit('my-va/');
      });
      it('and they have no payments in the last 30 days - C13195', () => {
        // make sure that the Payment and Debt section is shown
        cy.intercept('/v0/debts', debtsSuccess());
        cy.intercept('/v0/profile/payment_history', paymentsSuccess());
        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');
        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('view-payment-history-link').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
      it('and they have never had a payment - C14195', () => {
        // make sure that the Payment and Debt section is not shown
        cy.intercept('/v0/debts', debtsSuccess());
        cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty());
        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );
        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('view-payment-history-link').should('not.exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
      it('and they have debt - C14319', () => {
        // make sure that the Payment and Debt section is shown
        cy.intercept('/v0/debts', debtsSuccess());
        cy.intercept('/v0/profile/payment_history', paymentsSuccess());
        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');
        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('view-payment-history-link').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
      it('and they have no debt - C14320', () => {
        // make sure that the Payment and Debt section is shown
        cy.intercept('/v0/debts', debtsSuccessEmpty());
        cy.intercept('/v0/profile/payment_history', paymentsSuccess());
        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');
        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
      it('and they have a debt error but no payment error - C14390', () => {
        cy.intercept('/v0/debts', debtsError());
        cy.intercept('/v0/profile/payment_history', paymentsSuccess());
        cy.findByTestId('dashboard-section-payment-and-debts').should('exist');
        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('exist');
        cy.findByTestId('manage-direct-deposit-link').should('exist');
        cy.findByTestId('debts-error').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
      it('and they have a payment error but no debt error - C14391', () => {
        cy.intercept('/v0/debts', debtsSuccess());
        cy.intercept('/v0/profile/payment_history', paymentsError());
        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );
        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('payments-error').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
      it('and they have both a payment error and debt error - C14392', () => {
        cy.intercept('/v0/debts', debtsError());
        cy.intercept('/v0/profile/payment_history', paymentsError());
        cy.findByTestId('dashboard-section-payment-and-debts').should(
          'not.exist',
        );
        cy.findByTestId('payment-card').should('not.exist');
        cy.findByTestId('no-recent-payments-paragraph').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link').should('not.exist');
        cy.findByTestId('payments-error').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });
  });
});
