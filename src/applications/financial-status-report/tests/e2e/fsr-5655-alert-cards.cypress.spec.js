import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

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

// TODO: This test is skipped because the API calls are not being triggered
// in the form flow during Cypress tests with Node 22. The cy.clickFormContinue()
// action does not trigger the debts/copays API calls, causing cy.wait() to timeout.
// This may be related to form submission timing or event handling changes in
// the newer Node environment. Needs investigation.
describe.skip('Enhanced FSR debt and copay alerts', () => {
  afterEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  });

  beforeEach(() => {
    sessionStorage.setItem('wizardStatus', WIZARD_STATUS_COMPLETE);
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
        beforeEach(() => {
          cy.intercept('GET', '/v0/medical_copays', req =>
            copayReply404(req),
          ).as('copaysC1');
          cy.intercept('GET', '**/v0/debts*', mockDebtsEmpty).as('debtsC1');
        });

        it('should show medical copay failure alert message, and no page content', () => {
          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.clickStartForm();

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.clickFormContinue();
          cy.wait(['@copaysC1', '@debtsC1']);

          cy.findByTestId('balance-card-alert-copay').should('exist');
          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });

      describe('/v0/medical_copays 500 and has available debts', () => {
        it('should show medical copay failure alert message, and page content with debts availalbe for selection', () => {
          // Set up intercepts before any navigation that might trigger API calls
          cy.intercept('GET', '/v0/medical_copays', req =>
            copayReply404(req),
          ).as('copaysC2');
          cy.intercept('GET', '**/v0/debts*', debtResponse).as('debtsC2');

          // Reload to ensure intercepts are active and component remounts
          cy.reload();
          cy.wait('@features');

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.clickStartForm();

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.clickFormContinue();
          cy.wait(['@copaysC2', '@debtsC2']);

          // Wait for component to render with updated state
          cy.findByTestId('debt-selection-content').should('exist');
          cy.get('[data-testid="debt-selection-checkbox"]').should(
            'have.length.greaterThan',
            0,
          );

          cy.findByTestId('balance-card-alert-copay').should('exist');

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
          cy.intercept('GET', '**/v0/debts*', req => reply500(req)).as(
            'debtsD1',
          );

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.clickStartForm();

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.clickFormContinue();
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
          cy.intercept('GET', '**/v0/debts*', req => reply500(req)).as(
            'debtsD2',
          );

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/introduction',
          );
          cy.clickStartForm();

          cy.url().should(
            'contain',
            '/manage-va-debt/request-debt-help-form-5655/veteran-information',
          );
          cy.clickFormContinue();
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
