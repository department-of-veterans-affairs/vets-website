/**
 * [TestRail-integrated] Spec for My VA - Benefit Payments V2
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 8273
 * @testrailinfo runName MyVA-BenefitPmts-v2
 */
import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import {
  paymentsSuccess,
  paymentsSuccessEmpty,
} from '../fixtures/test-payments-response';
import { debtsSuccessEmpty } from '../fixtures/test-debts-response';
import { copaysSuccessEmpty } from '../fixtures/test-copays-response';
import appointmentsEmpty from '../fixtures/appointments-empty';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import {
  mockLocalStorage,
  makeUserObject,
} from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - Benefit Payments', () => {
  Cypress.config({ defaultCommandTimeout: 12000, requestTimeout: 20000 });
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

  describe('when the section renders correctly', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/debts', debtsSuccessEmpty()).as('noDebtsB');
      cy.intercept('GET', '/v0/medical_copays', copaysSuccessEmpty()).as(
        'noCopaysB',
      );
    });

    // With payments
    describe('and user has recent payments', () => {
      describe('with direct deposit', () => {
        it('shows payments card with deposit text - C20887', () => {
          cy.intercept(
            'GET',
            '/v0/profile/payment_history',
            paymentsSuccess(true),
          ).as('recentPayments1');

          cy.visit('my-va/');
          cy.wait(['@noDebtsB', '@noCopaysB', '@recentPayments1']);
          cy.findByTestId('dashboard-section-payment-v2').should('exist');

          cy.findByText(/Deposited/i).should('exist');
          cy.findByTestId('payment-card-view-history-link-v2').should('exist');
          cy.findByTestId('manage-direct-deposit-link-v2').should('exist');
          cy.findByTestId('view-payment-history-link-v2').should('not.exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck(
            '[data-testid="dashboard-section-payment-v2"]',
          );
        });
      });

      describe('with check', () => {
        it('shows payments card with check text - C20888', () => {
          cy.intercept(
            '/v0/profile/payment_history',
            paymentsSuccess(true, 'Paper Check'),
          ).as('recentPayments2');
          cy.visit('my-va/');
          cy.wait(['@noDebtsB', '@noCopaysB', '@recentPayments2']);
          cy.findByTestId('dashboard-section-payment-v2').should('exist');

          cy.findByText(/Check mailed/i).should('exist');
          cy.findByTestId('payment-card-view-history-link-v2').should('exist');
          cy.findByTestId('view-payment-history-link-v2').should('not.exist');
          cy.findByTestId('manage-direct-deposit-link-v2').should('exist');
          cy.findByTestId('view-payment-history-link-v2').should('not.exist');

          // make the a11y check
          cy.injectAxeThenAxeCheck(
            '[data-testid="dashboard-section-payment-v2"]',
          );
        });
      });
    });
    // no recent payments but payment history
    describe('and user has payment history', () => {
      it('shows no recent payment text with payment history link - C20889', () => {
        cy.intercept(
          'GET',
          '/v0/profile/payment_history',
          paymentsSuccess(),
        ).as('oldPayments1');
        cy.visit('my-va/');
        cy.wait(['@noDebtsB', '@noCopaysB', '@oldPayments1']);
        cy.findByTestId('dashboard-section-payment-v2').should('exist');

        cy.findByTestId('no-recent-payments-paragraph-v2').should('exist');
        cy.findByTestId('payment-card-view-history-link-v2').should(
          'not.exist',
        );
        cy.findByTestId('view-payment-history-link-v2').should('exist');
        cy.findByTestId('manage-direct-deposit-link-v2').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck(
          '[data-testid="dashboard-section-payment-v2"]',
        );
      });
    });
    // user never had a payment
    describe('and user has never had payments', () => {
      it('shows no recent payment text with no payment history link - C20890', () => {
        cy.intercept(
          'GET',
          '/v0/profile/payment_history',
          paymentsSuccessEmpty(),
        ).as('emptyPayments1');
        cy.visit('my-va/');
        cy.wait(['@noDebtsB', '@noCopaysB', '@emptyPayments1']);
        cy.findByTestId('dashboard-section-payment-v2').should('exist');

        cy.findByTestId('no-recent-payments-paragraph-v2').should('exist');
        cy.findByTestId('payment-card-view-history-link-v2').should(
          'not.exist',
        );
        cy.findByTestId('view-payment-history-link-v2').should('not.exist');
        cy.findByTestId('manage-direct-deposit-link-v2').should('exist');

        // make the a11y check
        cy.injectAxeThenAxeCheck(
          '[data-testid="dashboard-section-payment-v2"]',
        );
      });
    });
  });
});
// temporary test to prove it still works with the old method since claims is empty.
describe('when the payment history claims does not exist', () => {
  beforeEach(() => {
    mockLocalStorage();
    const mockUser1 = makeUserObject({
      isCerner: false,
      messaging: false,
      rx: false,
      facilities: [],
      isPatient: false,
      claims: {
        ch33BankAccounts: true,
        communicationPreferences: true,
        connectedApps: true,
        militaryHistory: true,
        paymentHistory: false,
        personalInformation: true,
        ratingInfo: true,
        appeals: true,
        medicalCopays: true,
      },
    });
    cy.login(mockUser1);
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
    cy.intercept('GET', '/v0/debts', debtsSuccessEmpty()).as('noDebtsC');
    cy.intercept('GET', '/v0/medical_copays', copaysSuccessEmpty()).as(
      'noCopaysC',
    );
  });
  it('the v2 dashboard shows up - C22832', () => {
    cy.visit('my-va/');
    // should show a loading indicator
    cy.findByRole('progressbar').should('exist');
    cy.findByText(/loading your information/i).should('exist');
    cy.wait(['@noDebtsC', '@noCopaysC']);
    // and then the loading indicator should be removed
    cy.findByRole('progressbar').should('not.exist');
    cy.findByText(/loading your information/i).should('not.exist');

    // make sure that the Benefit Payments & Outstanding Debts sections are shown
    cy.findByTestId('dashboard-section-payment-v2').should('exist');
    cy.findByTestId('dashboard-section-debts-v2').should('exist');

    // make the a11y checks
    cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-payment-v2"]');
    cy.injectAxeThenAxeCheck('[data-testid="dashboard-section-debts-v2"]');
  });
});
// test when claim is false
// temporary test to prove it still works with the old method since claims is empty.
describe('when the payment history claims is false', () => {
  beforeEach(() => {
    mockLocalStorage();
    const mockUser2 = makeUserObject({
      isCerner: false,
      messaging: false,
      rx: false,
      facilities: [],
      isPatient: false,
      claims: {
        ch33BankAccounts: true,
        communicationPreferences: true,
        connectedApps: true,
        militaryHistory: true,
        paymentHistory: false,
        personalInformation: true,
        ratingInfo: true,
        appeals: true,
        medicalCopays: true,
      },
    });
    cy.login(mockUser2);
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
    cy.intercept('GET', '/v0/debts', debtsSuccessEmpty()).as('noDebtsD');
    cy.intercept('GET', '/v0/medical_copays', copaysSuccessEmpty()).as(
      'noCopaysD',
    );
  });
  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('the v2 dashboard should show up - C22831', () => {
    cy.visit('my-va/');
    // should show a loading indicator
    cy.findByRole('progressbar').should('exist');
    cy.findByText(/loading your information/i).should('exist');
    cy.wait(['@noDebtsD', '@noCopaysD']);
    // and then the loading indicator should be removed
    cy.findByRole('progressbar').should('not.exist');
    cy.findByText(/loading your information/i).should('not.exist');

    // make sure that the Benefit Payments & Outstanding Debts sections are shown
    cy.findByTestId('dashboard-section-payment-v2').should('exist');
    cy.findByTestId('dashboard-section-debts-v2').should('exist');

    // A11y already checked in previous test C22832
  });
});
