import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import copayResponse from './fixtures/mocks/copays.json';
import debtResponse from './fixtures/mocks/debts.json';

const mockDebtsEmpty = { debts: [] };
const mockCopaysEmpty = { data: [] };

export const reply404 = req => {
  return req.reply(404, { errors: ['error'] });
};

export const reply403 = req => {
  return req.reply(403, {
    errors: [
      {
        title: 'Forbidden',
        detail: 'User does not have access to the requested resource',
        code: '403',
        status: '403',
      },
    ],
  });
};

const navigateToDebtSelection = () => {
  cy.get('#start-option-0').click();
  cy.get('#reconsider-option-2').click();
  cy.get('#recipients-option-1').click();
  cy.get('[data-testid="start-button"]').click();

  cy.get('va-button[text*="start"]')
    .first()
    .shadow()
    .find('button')
    .click();

  cy.findAllByText(/continue/i, { selector: 'button' })
    .first()
    .click();
};

describe('Enhanced FSR debt and copay alerts', () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.login(mockUser);

    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
          {
            name: 'combined_financial_status_report_enhancements',
            value: true,
          },
        ],
      },
    }).as('featureToggles');

    cy.intercept('GET', '/v0/in_progress_forms/5655', {
      formData: {
        personalIdentification: { ssn: '4437', fileNumber: '4437' },
        personalData: {
          veteranFullName: { first: 'Mark', last: 'Webb', suffix: 'Jr.' },
          address: {
            street: '123 Faker Street',
            city: 'Bogusville',
            state: 'GA',
            country: 'USA',
            postalCode: '30058',
          },
          telephoneNumber: '4445551212',
          emailAddress: 'test2@test1.net',
          dateOfBirth: '1950-10-04',
        },
        income: [{ veteranOrSpouse: 'VETERAN' }],
      },
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/veteran-information',
      },
    });
  });

  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });

  context(
    'Combined alerts; debts and copays both 404, or veteran has no debts or copays',
    () => {
      describe('Both /v0/medical_copays and /v0/debts APIs 404', () => {
        beforeEach(() => {
          cy.intercept('GET', '/v0/medical_copays', req => reply404(req)).as(
            'copaysA1',
          );
          cy.intercept('GET', '/v0/debts', req => reply404(req)).as('debtsA1');

          cy.visit(manifest.rootUrl);
        });

        it('should show combined failure alert message', () => {
          navigateToDebtSelection();
          cy.wait(['@copaysA1', '@debtsA1']);

          cy.findByTestId('balance-card-combo-alert-error').should('exist');

          cy.findByTestId('debt-selection-content').should('not.exist');

          cy.injectAxeThenAxeCheck();
        });
      });

      describe('Veteran has no debts or copays', () => {
        beforeEach(() => {
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

  context('Copay failure, mixed with debt success and no debts', () => {
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
  });

  context('Debt failure, mixed with copay success and no copays', () => {
    describe('/v0/debts 404 and no available copays', () => {
      beforeEach(() => {
        cy.intercept('GET', '/v0/medical_copays', mockCopaysEmpty).as(
          'copaysD1',
        );
        cy.intercept('GET', '/v0/debts', req => reply404(req)).as('debtsD1');
        cy.visit(manifest.rootUrl);
      });

      it('should show medical copay failure alert message, and no page content', () => {
        navigateToDebtSelection();
        cy.wait(['@copaysD1', '@debtsD1']);

        cy.findByTestId('balance-card-alert-debt').should('exist');
        cy.findByTestId('debt-selection-content').should('not.exist');

        cy.injectAxeThenAxeCheck();
      });
    });

    describe('/v0/debts 404 and has available copays', () => {
      beforeEach(() => {
        cy.intercept('GET', '/v0/medical_copays', copayResponse).as('copaysD2');
        cy.intercept('GET', '/v0/debts', req => reply404(req)).as('debtsD2');

        cy.visit(manifest.rootUrl);
      });

      it('should show medical copay failure alert message, and page content with debts availalbe for selection', () => {
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
  });
});
