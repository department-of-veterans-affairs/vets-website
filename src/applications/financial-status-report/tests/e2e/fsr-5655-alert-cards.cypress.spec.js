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

describe('Enhanced FSR debt and copay alerts', () => {
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
    'Unsuccessful `/v0/medical_copay` API Response mixed with successful and no debt response',
    () => {
      describe('/v0/medical_copays 500 and no available debts', () => {
        it('should show medical copay failure alert message, and no page content', () => {
          cy.intercept('GET', '/v0/medical_copays', req =>
            copayReply404(req),
          ).as('copaysC1');
          cy.intercept('GET', '/v0/debts*', mockDebtsEmpty).as('debtsC1');

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
          cy.wait(['@copaysC1', '@debtsC1']);

          cy.findByTestId('balance-card-alert-copay').should('exist');
          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });

      describe('/v0/medical_copays 500 and has available debts', () => {
        it('should show medical copay failure alert message, and page content with debts availalbe for selection', () => {
          cy.intercept('GET', '/v0/medical_copays', req =>
            copayReply404(req),
          ).as('copaysC2');
          cy.intercept('GET', '/v0/debts*', debtResponse).as('debtsC2');

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
          cy.wait(['@copaysC2', '@debtsC2']);

          cy.get('[data-testid="debt-selection-checkbox"]').should(
            'have.length.greaterThan',
            0,
          );

          cy.findByTestId('balance-card-alert-copay').should('exist');
          cy.findByTestId('debt-selection-content').should('exist');

          cy.injectAxeThenAxeCheck();
        });
      });
    },
  );

  context(
    'Unsuccessful `/v0/debts*` API Response mixed with successful and no copay response',
    () => {
      describe('/v0/debts* 500 and no available copays', () => {
        it('should show debt failure alert message, and no page content', () => {
          cy.intercept('GET', '/v0/medical_copays', mockCopaysEmpty).as(
            'copaysD1',
          );
          cy.intercept('GET', '/v0/debts*', req => reply500(req)).as('debtsD1');

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
          cy.wait(['@copaysD1', '@debtsD1']);

          cy.findByTestId('balance-card-alert-debt').should('exist');
          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });
      describe('/v0/debts* 500 and has available copays', () => {
        it('should show debt failure alert message, and page content with medical copays available for selection', () => {
          cy.intercept('GET', '/v0/medical_copays', copayResponse).as(
            'copaysD2',
          );
          cy.intercept('GET', '/v0/debts*', req => reply500(req)).as('debtsD2');

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
          cy.wait(['@copaysD2', '@debtsD2']);

          cy.get('[data-testid="copay-selection-checkbox"]').should(
            'have.length.greaterThan',
            0,
          );

          cy.findByTestId('balance-card-alert-debt').should('exist');
          cy.findByTestId('debt-selection-content').should('exist');

          cy.injectAxeThenAxeCheck();
        });
      });
    },
  );
});
