import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import manifest from '../../manifest.json';

import mockUser from './fixtures/mocks/mockUser.json';
import mockStatus from './fixtures/mocks/profile-status.json';

import copayResponse from './fixtures/mocks/copays.json';
import debtResponse from './fixtures/mocks/debts.json';
import {
  mockDebtsEmpty,
  mockCopaysEmpty,
  copayReply404,
  reply500,
} from './fixtures/helpers';

import saveInProgressData from './fixtures/mocks/saveInProgress.json';

// TODO: Skipping this test due to the Chromium Renderer crash issue.
// Track the progress of the fix in issue #63283

describe.skip('Enhanced FSR debt and copay alerts', () => {
  afterEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  });

  beforeEach(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
        ],
      },
    }).as('features');

    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', 'v0/user_transition_availabilities', {
      statusCode: 200,
    }).as('userTransition');
    cy.login(mockUser);
    cy.intercept('GET', '/v0/profile/status', mockStatus).as('profileStatus');

    cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgressData);
    cy.intercept('PUT', '/v0/in_progress_forms/5655', saveInProgressData);

    cy.visit(manifest.rootUrl);
  });

  context(
    'Combined alerts; debts and copays both 500, or veteran has no debts or copays',
    () => {
      describe('Both /v0/medical_copays and /v0/debts* APIs 500', () => {
        it('should show combined failure alert message', () => {
          cy.intercept('GET', '/v0/medical_copays', req =>
            copayReply404(req),
          ).as('copaysA1');
          cy.intercept('GET', '/v0/debts*', req => reply500(req)).as('debtsA1');

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.get('a.vads-c-action-link--green')
            .first()
            .click({ waitForAnimations: true });

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });

          // on debt selection page, wait for loading spinner to disappear
          cy.wait(['@copaysA1', '@debtsA1']);

          cy.get('[data-testid="balance-card-combo-alert-error"]').should(
            'exist',
          );
          cy.findByTestId('balance-card-combo-alert-error').should('exist');
          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });

      describe('Veteran has no debts or copays', () => {
        it('should show combined empty alert message', () => {
          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.intercept('GET', '/v0/medical_copays', mockCopaysEmpty).as(
            'copaysA2',
          );
          cy.intercept('GET', '/v0/debts*', mockDebtsEmpty).as('debtsA2');

          cy.get('a.vads-c-action-link--green')
            .first()
            .click({ waitForAnimations: true });

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });

          // on debt selection page, wait for loading spinner to disappear
          cy.wait(['@copaysA2', '@debtsA2']);

          cy.findByTestId('balance-card-combo-alert-zero').should('exist');
          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });
    },
  );

  context(
    'No alerts necessary Veteran has a mix of debts/copays and no debts/copays but no errors',
    () => {
      describe('has debts and copays', () => {
        it('should show page content, list of debts and copays for selection', () => {
          cy.intercept('GET', '/v0/medical_copays', copayResponse).as(
            'copaysB1',
          );
          cy.intercept('GET', '/v0/debts*', debtResponse).as('debtsB1');

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.get('a.vads-c-action-link--green')
            .first()
            .click({ waitForAnimations: true });

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
          cy.wait(['@copaysB1', '@debtsB1']);

          cy.get('[data-testid="debt-selection-checkbox"]').should(
            'have.length.greaterThan',
            0,
          );

          cy.get('[data-testid="copay-selection-checkbox"]').should(
            'have.length.greaterThan',
            0,
          );
          cy.findByTestId('balance-card-alert-debt').should('not.exist');
          cy.findByTestId('balance-card-alert-copay').should('not.exist');
          cy.findByTestId('debt-selection-content').should('exist');

          cy.injectAxeThenAxeCheck();
        });
      });

      describe('has debts and no available copays', () => {
        it('should show page content, list of debts, but no copays and no error messages', () => {
          cy.intercept('GET', '/v0/medical_copays', mockCopaysEmpty).as(
            'copaysB2',
          );
          cy.intercept('GET', '/v0/debts*', debtResponse).as('debtsB2');

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.get('a.vads-c-action-link--green')
            .first()
            .click({ waitForAnimations: true });

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
          cy.wait(['@copaysB2', '@debtsB2']);

          cy.get('[data-testid="debt-selection-checkbox"]').should(
            'have.length.greaterThan',
            0,
          );

          cy.get('[data-testid="copay-selection-checkbox"]').should(
            'not.exist',
          );
          cy.findByTestId('balance-card-alert-debt').should('not.exist');
          cy.findByTestId('balance-card-alert-copay').should('not.exist');
          cy.findByTestId('debt-selection-content').should('exist');

          cy.injectAxeThenAxeCheck();
        });
      });

      describe('has copays and no available debts', () => {
        it('should show page content, list of copays, but no debts and no error messages', () => {
          cy.intercept('GET', '/v0/medical_copays', copayResponse).as(
            'copaysB3',
          );
          cy.intercept('GET', '/v0/debts*', mockDebtsEmpty).as('debtsB3');

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.get('a.vads-c-action-link--green')
            .first()
            .click({ waitForAnimations: true });

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click();
          cy.wait(['@copaysB3', '@debtsB3']);

          cy.get('[data-testid="debt-selection-checkbox"]').should('not.exist');

          cy.get('[data-testid="copay-selection-checkbox"]').should(
            'have.length.greaterThan',
            0,
          );

          cy.findByTestId('balance-card-alert-debt').should('not.exist');
          cy.findByTestId('balance-card-alert-copay').should('not.exist');
          cy.findByTestId('debt-selection-content').should('exist');

          cy.injectAxeThenAxeCheck();
        });
      });
    },
  );
});
