import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import copayResponse from './fixtures/mocks/copays.json';
import debtResponse from './fixtures/mocks/debts.json';
import {
  navigateToDebtSelection,
  mockDebtsEmpty,
  mockCopaysEmpty,
  reply404,
  reply500,
} from './fixtures/helpers';
import saveInProgressData from './fixtures/mocks/saveInProgress.json';

describe('Enhanced FSR debt and copay alerts', () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
        ],
      },
    });

    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.login(mockUser);

    cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgressData);
    cy.visit(manifest.rootUrl);
  });

  context(
    'Combined alerts; debts and copays both 404, or veteran has no debts or copays',
    () => {
      describe('Both /v0/medical_copays and /v0/debts APIs 404', () => {
        before(() => {
          cy.intercept('GET', '/v0/medical_copays', req => reply404(req)).as(
            'copaysA1',
          );
          cy.intercept('GET', '/v0/debts', req => reply404(req)).as('debtsA1');

          cy.visit(manifest.rootUrl);
        });

        it('should show combined failure alert message', () => {
          navigateToDebtSelection();
          // cy.wait(['@copaysA1', '@debtsA1']);

          cy.findByTestId('balance-card-combo-alert-error').should('exist');

          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });

      describe('Veteran has no debts or copays', () => {
        before(() => {
          cy.intercept('GET', '/v0/medical_copays', mockCopaysEmpty).as(
            'copaysA2',
          );
          cy.intercept('GET', '/v0/debts', mockDebtsEmpty).as('debtsA2');

          cy.visit(manifest.rootUrl);
        });

        it('should show combined empty alert message', () => {
          navigateToDebtSelection();
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
        beforeEach(() => {
          cy.intercept('GET', '/v0/medical_copays', copayResponse).as(
            'copaysB1',
          );
          cy.intercept('GET', '/v0/debts', debtResponse).as('debtsB1');
          cy.visit(manifest.rootUrl);
        });

        it('should show page content, list of debts and copays for selection', () => {
          navigateToDebtSelection();
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
        beforeEach(() => {
          cy.intercept('GET', '/v0/medical_copays', mockCopaysEmpty).as(
            'copaysB2',
          );
          cy.intercept('GET', '/v0/debts', debtResponse).as('debtsB2');

          cy.visit(manifest.rootUrl);
        });

        it('should show page content, list of debts, but no copays and no error messages', () => {
          navigateToDebtSelection();
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
        beforeEach(() => {
          cy.intercept('GET', '/v0/medical_copays', copayResponse).as(
            'copaysB3',
          );
          cy.intercept('GET', '/v0/debts', mockDebtsEmpty).as('debtsB3');

          cy.visit(manifest.rootUrl);
        });

        it('should show page content, list of copays, but no debts and no error messages', () => {
          navigateToDebtSelection();
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

  context(
    'Unsuccessful `/v0/medical_copay` API Response mixed with successful and no debt response',
    () => {
      describe('/v0/medical_copays 404 and no available debts', () => {
        beforeEach(() => {
          cy.intercept('GET', '/v0/medical_copays', req => reply404(req)).as(
            'copaysC1',
          );
          cy.intercept('GET', '/v0/debts', mockDebtsEmpty).as('debtsC1');

          cy.visit(manifest.rootUrl);
        });

        it('should show medical copay failure alert message, and no page content', () => {
          navigateToDebtSelection();
          cy.wait(['@copaysC1', '@debtsC1']);

          cy.findByTestId('balance-card-alert-copay').should('exist');
          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });

      describe('/v0/medical_copays 404 and has available debts', () => {
        beforeEach(() => {
          cy.intercept('GET', '/v0/medical_copays', req => reply404(req)).as(
            'copaysC2',
          );
          cy.intercept('GET', '/v0/debts', debtResponse).as('debtsC2');

          cy.visit(manifest.rootUrl);
        });

        it('should show medical copay failure alert message, and page content with debts availalbe for selection', () => {
          navigateToDebtSelection();
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
    'Unsuccessful `/v0/debts` API Response mixed with successful and no copay response',
    () => {
      describe('Veteran has no available copays', () => {
        before(() => {
          cy.intercept('GET', '/v0/medical_copays', mockCopaysEmpty).as(
            'copaysD1',
          );
          cy.intercept('GET', '/v0/debts', req => reply500(req)).as('debtsD1');
          cy.visit(manifest.rootUrl);
        });
        it('should show debt failure alert message, and no page content', () => {
          navigateToDebtSelection();
          cy.wait(['@copaysD1', '@debtsD1']);

          cy.findByTestId('balance-card-alert-debt').should('exist');
          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });
      describe('Veteran has available copays', () => {
        before(() => {
          cy.intercept('GET', '/v0/medical_copays', copayResponse).as(
            'copaysD2',
          );
          cy.intercept('GET', '/v0/debts', req => reply500(req)).as('debtsD2');
          cy.visit(manifest.rootUrl);
        });
        it('should show debtfailure alert message, and page content with medical copays available for selection', () => {
          navigateToDebtSelection();
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
