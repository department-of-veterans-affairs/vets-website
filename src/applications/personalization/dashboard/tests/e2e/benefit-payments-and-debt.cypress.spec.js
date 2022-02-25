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
  describe('when the feature is hidden', () => {
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
  describe('when the feature is not hidden', () => {
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

    context('and user has payments', () => {
      beforeEach(() => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess(true));
        cy.intercept('/v0/debts', debtsSuccess());
        cy.visit('my-va/');
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

    context('and user has no payments', () => {
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
