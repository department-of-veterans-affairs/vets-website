/**
 * [TestRail-integrated] Spec for My VA - Benefits Payments & Debt V2
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 3426
 * @testrailinfo runName MyVA-PmtsDebtsV2
 */
import { mockUser } from '@@profile/tests/fixtures/users/user';
import { mockUser as mockUserWithoutClaims } from '@@profile/tests/fixtures/users/user-without-claims';
import { mockUser as mockUserWithFalseClaims } from '@@profile/tests/fixtures/users/user-with-false-claims';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
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
  Cypress.config({ defaultCommandTimeout: 12000, requestTimeout: 20000 });
  describe('when the feature is hidden', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [],
        },
      }).as('featuresA');
    });
    it('the v2 dashboard does not show up - C20877', () => {
      cy.visit('my-va/');
      // make sure that the Payments and debts sections are not shown
      cy.findByTestId('dashboard-section-payment-v2').should('not.exist');
      cy.findByTestId('dashboard-section-debts-v2').should('not.exist');

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
        it('shows copays and no debts - C20878', () => {
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
        it('shows no outstanding debts - C20879', () => {
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
        it('shows error and no debts or copays card - C20880', () => {
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
        it('shows copays and debts - C20881', () => {
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
        it('shows debt card and no copays - C20882', () => {
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
        it('shows error and debts card - C20883', () => {
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
        it('shows error and copays card - C20884', () => {
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
        it('shows error and no copays card - C20885', () => {
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
        it('shows error and no cards - C20886', () => {
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
    describe('and user has recent payments', () => {
      describe('with direct deposit', () => {
        it('shows payments card with deposit text - C20887', () => {
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
        it('shows payments card with check text - C20888', () => {
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
    // no recent payments but payment history
    describe('and user has payment history', () => {
      it('shows no recent payment text with payment history link - C20889', () => {
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
    // user never had a payment
    describe('and user has never had payments', () => {
      it('shows no recent payment text with no payment history link - C20890', () => {
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
    // user has payments error
    describe('and payments API error', () => {
      it('shows error - C20891', () => {
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
// temporary test to prove it still works with the old method since claims is empty.
describe('when the payment history claims does not exist', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.login(mockUserWithoutClaims);
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
    }).as('featuresC');
  });
  it('the v2 dashboard shows up - C22832', () => {
    cy.visit('my-va/');
    // should show a loading indicator
    cy.findByRole('progressbar').should('exist');
    cy.findByText(/loading your information/i).should('exist');
    cy.wait(['@featuresC']);
    // and then the loading indicator should be removed
    cy.findByRole('progressbar').should('not.exist');
    cy.findByText(/loading your information/i).should('not.exist');
    // make sure that the payment and debts sections are shown
    cy.findByTestId('dashboard-section-payment-v2').should('exist');
    cy.findByTestId('dashboard-section-debts-v2').should('exist');

    // make the a11y check
    cy.injectAxeThenAxeCheck();
  });
});
// test when claim is false
// temporary test to prove it still works with the old method since claims is empty.
describe('when the payment history claims is false', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.login(mockUserWithFalseClaims);
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
    }).as('featuresD');
  });
  it('the v2 dashboard should show up - C22831', () => {
    cy.visit('my-va/');
    // should show a loading indicator
    cy.findByRole('progressbar').should('exist');
    cy.findByText(/loading your information/i).should('exist');
    cy.wait(['@featuresD']);
    // and then the loading indicator should be removed
    cy.findByRole('progressbar').should('not.exist');
    cy.findByText(/loading your information/i).should('not.exist');
    // make sure that the payment and debts sections are shown
    cy.findByTestId('dashboard-section-payment-v2').should('exist');
    cy.findByTestId('dashboard-section-debts-v2').should('exist');

    // make the a11y check
    cy.injectAxeThenAxeCheck();
  });
});
