import { generateFeatureToggles } from '../../../../check-in/day-of/api/local-mock-api/mocks/feature.toggles';
import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import { paymentsSuccess } from '../fixtures/test-payments-response';
import debtsSuccess from '../fixtures/debts.json';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - Payments and Debt', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.login(mockUser);
    cy.visit('my-va/');
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
  context("when it can't show payment and debt section", () => {
    it('when the current benefits payment shows up', () => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
      // make sure that the Payment and Debt section is shown
      cy.findByTestId('dashboard-section-payment-and-debts').should(
        'not.exist',
      );
      cy.findByRole('link', { name: /manage your direct deposit/i }).should(
        'not.exist',
      );
      cy.findByRole('heading', {
        name: /We deposited.*in your account/i,
      }).should('not.exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });
  context('when it can show payment and debt section', () => {
    it('when the current benefits payment shows up and they have payments in the last 30 days', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          showPaymentAndDebtSection: true,
        }),
      );
      cy.intercept('/v0/profile/payment_history', paymentsSuccess(true));
      cy.intercept('/v0/debts', debtsSuccess);
      // make sure that the Payment and Debt section is shown
      cy.findByTestId('dashboard-section-payment-and-debts').should('exist');
      cy.findByRole('link', { name: /manage your direct deposit/i }).should(
        'exist',
      );
      cy.findByRole('heading', {
        name: /We deposited.*in your account/i,
      }).should('exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
    it('when the current benefits payment shows up and they have no payments in the last 30 days', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          showPaymentAndDebtSection: true,
        }),
      );
      cy.intercept('/v0/profile/payment_history', paymentsSuccess());
      cy.intercept('/v0/debts', debtsSuccess);
      // make sure that the Payment and Debt section is shown
      cy.findByTestId('dashboard-section-payment-and-debts').should('exist');
      cy.findByRole('link', { name: /manage your direct deposit/i }).should(
        'exist',
      );
      cy.findByRole('link', { name: /view your payment history/i }).should(
        'exist',
      );
      cy.findByText(/you*.*payments in the past 30 days/i).should('exist');
      cy.findByRole('heading', {
        name: /We deposited.*in your account/i,
      }).should('not.exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
