/**
 * [TestRail-integrated] Spec for My VA - Outstanding Debts
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 8272
 * @testrailinfo runName MyVA-OutstandingDebts
 */
import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import { paymentsSuccessEmpty } from '../fixtures/test-payments-response';
import {
  debtsSuccess,
  debtsSuccessEmpty,
} from '../fixtures/test-debts-response';
import {
  copaysSuccess,
  copaysSuccessEmpty,
} from '../fixtures/test-copays-response';
import appointmentsEmpty from '../fixtures/appointments-empty';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - Outstanding Debts', () => {
  Cypress.config({ defaultCommandTimeout: 12000, requestTimeout: 25000 });
  beforeEach(() => {
    mockLocalStorage();
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/benefits_claims', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('vaos/v0/appointments*', appointmentsEmpty);
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
  });

  describe('when the section renders correctly', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
        'noPaymentsB',
      );
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
          cy.wait(['@noPaymentsB', '@noDebts1', '@recentCopays1']);
          cy.findByTestId('dashboard-section-debts').should('exist');

          cy.findByTestId('copay-card').should('exist');
          cy.findByTestId('debt-card').should('not.exist');
          cy.findByTestId('copay-due-header').should('exist');
          cy.findByTestId('manage-va-copays-link').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-debts"]');
        });
      });

      describe('and no copays', () => {
        it('shows no outstanding debts - C20879', () => {
          cy.intercept('/v0/medical_copays', copaysSuccessEmpty()).as(
            'emptyCopays1',
          );
          cy.visit('my-va/');
          cy.wait(['@noPaymentsB', '@noDebts1', '@emptyCopays1']);
          cy.findByTestId('dashboard-section-debts').should('exist');

          cy.findByTestId('copay-card').should('not.exist');
          cy.findByTestId('debt-card').should('not.exist');
          cy.findByTestId('copay-due-header').should('not.exist');
          cy.findByTestId('no-outstanding-debts-text').should('exist');
          cy.findByTestId('learn-va-debt-link').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-debts"]');
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
          cy.wait(['@noPaymentsB', '@recentDebts1', '@recentCopays1']);
          cy.findByTestId('dashboard-section-debts').should('exist');

          cy.findByTestId('copay-card').should('exist');
          cy.findByTestId('debt-card').should('exist');
          cy.findByTestId('copay-due-header').should('exist');
          cy.findByTestId('debt-total-header').should('exist');
          cy.findByTestId('manage-va-copays-link').should('exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-debts"]');
        });
      });

      describe('and no copays', () => {
        it('shows debt card and no copays - C20882', () => {
          cy.intercept('/v0/medical_copays', copaysSuccessEmpty()).as(
            'emptyCopays1',
          );
          cy.visit('my-va/');
          cy.wait(['@noPaymentsB', '@recentDebts1', '@emptyCopays1']);
          cy.findByTestId('dashboard-section-debts').should('exist');

          cy.findByTestId('copay-card').should('not.exist');
          cy.findByTestId('debt-card').should('exist');
          cy.findByTestId('copay-due-header').should('not.exist');
          cy.findByTestId('debt-total-header').should('exist');
          cy.findByTestId('learn-va-debt-link').should('not.exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-debts"]');
        });
      });
    });
  });
});
