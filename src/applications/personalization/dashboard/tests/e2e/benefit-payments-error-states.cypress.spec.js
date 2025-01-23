/**
 * [TestRail-integrated] Spec for My VA - Benefits Payments & Debt
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 8235
 * @testrailinfo runName MyVA-BenefitPmts-ErrorStates
 */
import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import manifest from 'applications/personalization/dashboard/manifest.json';
import { paymentsServerError } from '../fixtures/test-payments-response';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import { debtsSuccessEmpty } from '../fixtures/test-debts-response';
import { copaysSuccessEmpty } from '../fixtures/test-copays-response';
import { notificationsSuccessEmpty } from '../fixtures/test-notifications-response';

// currently there's just one error-state, but we're keeping blocks-structure for scalability.
describe('My VA - Benefit payments - error-states', () => {
  Cypress.config({ defaultCommandTimeout: 12000, requestTimeout: 20000 });
  beforeEach(() => {
    mockLocalStorage();
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/benefits_claims', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('GET', '/vaos/v2/appointments*', {
      data: [],
    });
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
    cy.intercept('/v0/debts', debtsSuccessEmpty()).as('noDebts');
    cy.intercept('/v0/medical_copays', copaysSuccessEmpty()).as('noCopays');
    cy.intercept('/v0/onsite_notifications', notificationsSuccessEmpty()).as(
      'notifications1',
    );
    cy.login(mockUser);
  });

  describe('Payments API-error', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/payment_history', paymentsServerError()).as(
        'paymentsServerErrorA',
      );
    });

    it('shows error - C30358', () => {
      cy.visit(manifest.rootUrl);
      cy.wait(['@noDebts', '@noCopays', '@paymentsServerErrorA']);

      cy.findByTestId('dashboard-section-debts').should('exist');
      cy.findByTestId('dashboard-section-payment').should('exist');
      cy.findByTestId('payments-error').should('exist');
      cy.findByTestId('payment-card-view-history-link').should('not.exist');
      cy.findByTestId('view-payment-history-link').should('exist');
      cy.findByTestId('manage-direct-deposit-link').should('exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-payment"]');
    });
  });
});
