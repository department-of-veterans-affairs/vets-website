/**
 * [TestRail-integrated] Spec for My VA - Benefits Payments & Debt V2
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 3428
 * @testrailinfo runName My VA - Pmt Info v2
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
import {
  copaysError,
  copaysSuccess,
  copaysSuccessEmpty,
} from '../fixtures/test-copays-response';
import appointmentsEmpty from '../fixtures/appointments-empty';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - Payments and Debt', () => {
  beforeEach(() => {
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
  Cypress.config({ defaultCommandTimeout: 12000 });
  describe('when the feature is hidden', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [],
        },
      }).as('featuresA');
    });
    it('the v2 dashboard does not show up', () => {
      cy.visit('my-va/');
      // make sure that the Notification section is not shown
      cy.findByTestId('dashboard-section-payment-and-debts-v2').should(
        'not.exist',
      );

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
      }).as('featuresB');
    });
    // No Debts
    describe('and user has no debts', () => {
      beforeEach(() => {
        cy.intercept('/v0/debts', debtsSuccessEmpty()).as('noDebts1');
      });

      describe('and copays exist', () => {
        it('shows copays and no debts - C14319', () => {
          cy.intercept('/v0/medical_copays', copaysSuccess(true)).as(
            'recentCopays1',
          );
          cy.visit('my-va/');
          cy.wait(['@noDebts1', '@recentCopays1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('exist');
          cy.findByTestId('debt-card-v2').should('not.exist');
          cy.findByTestId('copay-due-header-v2').should('exist');
          cy.findByTestId('manage-va-copays-link-v2').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      describe('and no copays', () => {
        it('shows no outstanding debts - C14320', () => {
          cy.intercept('/v0/medical_copays', copaysSuccessEmpty()).as(
            'emptyCopays1',
          );
          cy.visit('my-va/');
          cy.wait(['@noDebts1', '@emptyCopays1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('not.exist');
          cy.findByTestId('debt-card-v2').should('not.exist');
          cy.findByTestId('copay-due-header-v2').should('not.exist');
          cy.findByTestId('no-outstanding-debts-text').should('exist');
          cy.findByTestId('learn-va-debt-link-v2').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      describe('and copays API error', () => {
        it('shows error and no debts or copays card - C14675', () => {
          cy.intercept('/v0/medical_copays', copaysError()).as('copaysError1');
          cy.visit('my-va/');
          cy.wait(['@noDebts1', '@copaysError1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('not.exist');
          cy.findByTestId('debt-card-v2').should('not.exist');
          cy.findByTestId('copay-due-header-v2').should('not.exist');
          cy.findByTestId('no-outstanding-debts-text').should('not.exist');
          cy.findByTestId('outstanding-debts-error').should('exist');
          cy.findByTestId('learn-va-debt-link-v2').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });
    });
    // With debts
    describe('and user has recent debts', () => {
      beforeEach(() => {
        cy.intercept('/v0/debts', debtsSuccess(true)).as('recentDebts1');
      });

      describe('and copays exist', () => {
        it('shows copays and debts - C14319', () => {
          cy.intercept('/v0/medical_copays', copaysSuccess(true)).as(
            'recentCopays1',
          );
          cy.visit('my-va/');
          cy.wait(['@recentDebts1', '@recentCopays1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('exist');
          cy.findByTestId('debt-card-v2').should('exist');
          cy.findByTestId('copay-due-header-v2').should('exist');
          cy.findByTestId('debt-total-header-v2').should('exist');
          cy.findByTestId('manage-va-copays-link-v2').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      describe('and no copays', () => {
        it('shows debt card and no copays - C14320', () => {
          cy.intercept('/v0/medical_copays', copaysSuccessEmpty()).as(
            'emptyCopays1',
          );
          cy.visit('my-va/');
          cy.wait(['@recentDebts1', '@emptyCopays1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('not.exist');
          cy.findByTestId('debt-card-v2').should('exist');
          cy.findByTestId('copay-due-header-v2').should('not.exist');
          cy.findByTestId('debt-total-header-v2').should('exist');
          cy.findByTestId('learn-va-debt-link-v2').should('not.exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      describe('and copays API error', () => {
        it('shows error and debts card - C14675', () => {
          cy.intercept('/v0/medical_copays', copaysError()).as('copaysError1');
          cy.visit('my-va/');
          cy.wait(['@recentDebts1', '@copaysError1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('not.exist');
          cy.findByTestId('debt-card-v2').should('exist');
          cy.findByTestId('copay-due-header-v2').should('not.exist');
          cy.findByTestId('no-outstanding-debts-text').should('not.exist');
          cy.findByTestId('outstanding-debts-error').should('exist');
          cy.findByTestId('learn-va-debt-link-v2').should('not.exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });
    });
    // With debts error
    describe('and user has debts error', () => {
      beforeEach(() => {
        cy.intercept('/v0/debts', debtsError()).as('debtsError1');
      });

      describe('and copays exist', () => {
        it('shows error and copays card - C14319', () => {
          cy.intercept('/v0/medical_copays', copaysSuccess(true)).as(
            'recentCopays1',
          );
          cy.visit('my-va/');
          cy.wait(['@debtsError1', '@recentCopays1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('exist');
          cy.findByTestId('debt-card-v2').should('not.exist');
          cy.findByTestId('copay-due-header-v2').should('exist');
          cy.findByTestId('manage-va-copays-link-v2').should('exist');
          cy.findByTestId('outstanding-debts-error').should('exist');
          cy.findByTestId('learn-va-debt-link-v2').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      describe('and no copays', () => {
        it('shows error and no copays card - C14320', () => {
          cy.intercept('/v0/medical_copays', copaysSuccessEmpty()).as(
            'emptyCopays1',
          );
          cy.visit('my-va/');
          cy.wait(['@debtsError1', '@emptyCopays1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('not.exist');
          cy.findByTestId('debt-card-v2').should('not.exist');
          cy.findByTestId('copay-due-header-v2').should('not.exist');
          cy.findByTestId('outstanding-debts-error').should('exist');
          cy.findByTestId('learn-va-debt-link-v2').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });

      describe('and copays API error', () => {
        it('shows error - C14675', () => {
          cy.intercept('/v0/medical_copays', copaysError()).as('copaysError1');
          cy.visit('my-va/');
          cy.wait(['@debtsError1', '@copaysError1', '@featuresB']);

          cy.findByTestId('dashboard-section-debts-v2').should('exist');

          cy.findByTestId('copay-card-v2').should('not.exist');
          cy.findByTestId('debt-card-v2').should('not.exist');
          cy.findByTestId('copay-due-header-v2').should('not.exist');
          cy.findByTestId('no-outstanding-debts-text').should('not.exist');
          cy.findByTestId('outstanding-debts-error').should('exist');
          cy.findByTestId('learn-va-debt-link-v2').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });
    });
    // With payments
    describe('and user has current payments', () => {
      describe('with direct deposit', () => {
        it('shows payments card with deposit text - C14319', () => {
          cy.intercept('/v0/profile/payment_history', paymentsSuccess(true)).as(
            'recentPayments1',
          );
          cy.visit('my-va/');
          cy.wait(['@recentPayments1', '@featuresB']);

          cy.findByTestId('dashboard-section-payment-v2').should('exist');
          cy.findByText(/Deposited/i).should('exist');
          cy.findByTestId('payment-card-view-history-link-v2').should('exist');
          cy.findByTestId('manage-direct-deposit-link-v2').should('exist');
          cy.findByTestId('view-payment-history-link-v2').should('not.exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });
      describe('with check', () => {
        it('shows payments card with check text - C14319', () => {
          cy.intercept(
            '/v0/profile/payment_history',
            paymentsSuccess(true, 'Paper Check'),
          ).as('recentPayments2');
          cy.visit('my-va/');
          cy.wait(['@recentPayments2', '@featuresB']);

          cy.findByTestId('dashboard-section-payment-v2').should('exist');
          cy.findByText(/Check mailed/i).should('exist');
          cy.findByTestId('payment-card-view-history-link-v2').should('exist');
          cy.findByTestId('view-payment-history-link-v2').should('not.exist');
          cy.findByTestId('manage-direct-deposit-link-v2').should('exist');
          cy.findByTestId('view-payment-history-link-v2').should('not.exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck();
        });
      });
    });

    describe('and user has payment history', () => {
      it('shows no recent payment text and no payment history link - C14320', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccess()).as(
          'oldPayments1',
        );
        cy.visit('my-va/');
        cy.wait(['@oldPayments1', '@featuresB']);

        cy.findByTestId('dashboard-section-payment-v2').should('exist');
        cy.findByTestId('no-recent-payments-paragraph-v2').should('exist');
        cy.findByTestId('payment-card-view-history-link-v2').should(
          'not.exist',
        );
        cy.findByTestId('view-payment-history-link-v2').should('exist');
        cy.findByTestId('manage-direct-deposit-link-v2').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });

    describe('and user has never had payments', () => {
      it('shows no payment history - C14320', () => {
        cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
          'emptyPayments1',
        );
        cy.visit('my-va/');
        cy.wait(['@emptyPayments1', '@featuresB']);

        cy.findByTestId('dashboard-section-payment-v2').should('exist');
        cy.findByTestId('no-recent-payments-paragraph-v2').should('exist');
        cy.findByTestId('payment-card-view-history-link-v2').should(
          'not.exist',
        );
        cy.findByTestId('view-payment-history-link-v2').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link-v2').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });

    describe('and payments API error', () => {
      it('shows error - C14675', () => {
        cy.intercept('/v0/profile/payment_history', paymentsError()).as(
          'paymentsError1',
        );
        cy.visit('my-va/');
        cy.wait(['@paymentsError1', '@featuresB']);

        cy.findByTestId('dashboard-section-payment-v2').should('exist');
        cy.findByTestId('payments-v2-error').should('exist');
        cy.findByTestId('payment-card-view-history-link-v2').should(
          'not.exist',
        );
        cy.findByTestId('view-payment-history-link-v2').should('exist');
        cy.findByTestId('manage-direct-deposit-link-v2').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });
  });
});
