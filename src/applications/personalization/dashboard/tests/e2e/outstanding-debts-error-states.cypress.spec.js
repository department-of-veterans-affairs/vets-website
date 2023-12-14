/**
 * [TestRail-integrated] Spec for My VA - Benefits Payments & Debt
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 8201
 * @testrailinfo runName MyVA-e2e-OutstandingDebts-ErrorStates
 */
import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import { paymentsSuccessEmpty } from '../fixtures/test-payments-response';
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

describe('My VA - Outstanding debts error-states', () => {
  Cypress.config({ defaultCommandTimeout: 12000, requestTimeout: 20000 });
  beforeEach(() => {
    mockLocalStorage();
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
    cy.intercept('/v0/profile/payment_history', paymentsSuccessEmpty()).as(
      'noPayments',
    );
    cy.login(mockUser);
  });

  describe('Debts API-error', () => {
    beforeEach(() => {
      cy.intercept('/v0/debts', debtsError()).as('debtsErrorA');
    });

    it('shows error - user has copays - C30235', () => {
      cy.intercept('GET', '/v0/medical_copays', copaysSuccess(true)).as(
        'recentCopays1',
      );

      cy.visit('my-va/');
      cy.wait(['@debtsErrorA', '@recentCopays1']);
      cy.findByTestId('dashboard-section-debts').should('exist');

      cy.findAllByTestId('outstanding-debts-error').should('exist');
      cy.findByTestId('debt-card').should('not.exist');
      cy.findByTestId('copay-card').should('exist');
      cy.findByTestId('copay-due-header').should('exist');
      cy.findByTestId('manage-va-copays-link').should('exist');
      cy.findAllByTestId('learn-va-debt-link').should('exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-debts"]');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('shows error - user has no copays - C30237', () => {
      cy.intercept('/v0/medical_copays', copaysSuccessEmpty()).as('noCopays1');

      cy.visit('my-va/');
      cy.wait(['@debtsErrorA', '@noCopays1']);
      cy.findByTestId('dashboard-section-debts').should('exist');

      cy.findByTestId('outstanding-debts-error').should('exist');
      cy.findByTestId('debt-card').should('not.exist');
      cy.findByTestId('copay-card').should('not.exist');
      cy.findByTestId('copay-due-header').should('not.exist');
      cy.findByTestId('manage-va-copays-link').should('not.exist');
      cy.findByTestId('learn-va-debt-link').should('exist');

      // skipping axe-check - already checked in previous test C30235
    });
  });

  describe('Copays API-error', () => {
    beforeEach(() => {
      cy.intercept('/v0/medical_copays', copaysError()).as('copaysErrorA');
    });

    it('shows error - User has debts - C30247', () => {
      cy.intercept('/v0/debts', debtsSuccess(true)).as('recentDebts1');

      cy.visit('my-va/');
      cy.wait(['@copaysErrorA', '@recentDebts1']);
      cy.findByTestId('dashboard-section-debts').should('exist');

      cy.findByTestId('outstanding-debts-error').should('exist');
      cy.findByTestId('debt-card').should('exist');
      cy.findByTestId('copay-card').should('not.exist');
      cy.findByTestId('copay-due-header').should('not.exist');
      cy.findByTestId('no-outstanding-debts-text').should('not.exist');
      cy.findByTestId('learn-va-debt-link').should('not.exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-debts"]');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('shows error - User has no debts - C30251', () => {
      cy.intercept('/v0/debts', debtsSuccessEmpty(true)).as('noDebts1');

      cy.visit('my-va/');
      cy.wait(['@copaysErrorA', '@noDebts1']);
      cy.findByTestId('dashboard-section-debts').should('exist');

      cy.findByTestId('outstanding-debts-error').should('exist');
      cy.findByTestId('debt-card').should('not.exist');
      cy.findByTestId('copay-card').should('not.exist');
      cy.findByTestId('copay-due-header').should('not.exist');
      cy.findByTestId('no-outstanding-debts-text').should('not.exist');
      cy.findByTestId('learn-va-debt-link').should('exist');

      // skipping axe-check - already checked in previous test C30247
    });
  });

  describe('Debts & Copays API-errors', () => {
    beforeEach(() => {
      cy.intercept('/v0/debts', debtsError()).as('debtsErrorB');
      cy.intercept('/v0/medical_copays', copaysError()).as('copaysErrorB');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('shows error - C30324', () => {
      cy.visit('my-va/');
      cy.wait(['@debtsErrorB', '@copaysErrorB']);
      cy.findByTestId('dashboard-section-debts').should('exist');

      cy.findByTestId('outstanding-debts-error').should('exist');
      cy.findByTestId('debt-card').should('not.exist');
      cy.findByTestId('copay-card').should('not.exist');
      cy.findByTestId('copay-due-header').should('not.exist');
      cy.findByTestId('no-outstanding-debts-text').should('not.exist');
      cy.findByTestId('learn-va-debt-link').should('exist');

      // skipping axe-check - already checked in previous tests
    });
  });
});
