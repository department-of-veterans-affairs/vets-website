import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import { deductionCodes } from '../../../debt-letters/const/deduction-codes';

describe('Fetch Debts Successfully', () => {
  before(() => {
    const approvedDeductionCodes = Object.keys(deductionCodes);

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

    const getDebts = () => {
      const options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Key-Inflection': 'camel',
          'Source-App-Name': window.appName,
        },
      };
    };

    cy.intercept('GET', '/v0/debts*', {
      // data: {
      //   features: [
      //     { name: 'show_financial_status_report_wizard', value: true },
      //     { name: 'show_financial_status_report', value: true },
      //   ],
      // },
    });
    const response = getDebts();

    const filteredResponse = response.debts
      .filter(debt => approvedDeductionCodes.includes(debt.deductionCode))
      .filter(debt => debt.currentAr > 0)
      .map((debt, index) => ({ ...debt, id: index }));

    cy.visit(manifest.rootUrl);
  });
  it('Successful API Response', () => {
    cy.get('span').should('have.text', 'What debt do you need help with?');

    cy.injectAxeThenAxeCheck();
  });
});
