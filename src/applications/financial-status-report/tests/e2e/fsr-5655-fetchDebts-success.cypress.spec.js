import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
// import { deductionCodes } from '../../../debt-letters/const/deduction-codes';

describe('Fetch Debts Successfully', () => {
  before(() => {
    // const approvedDeductionCodes = Object.keys(deductionCodes);

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

    cy.intercept('GET', '/v0/debts', {
      data: {
        hasDependentDebts: false,
        debts: [
          {
            fileNumber: '796104437',
            payeeNumber: '00',
            personEntitled: 'AJHONS',
            deductionCode: '72',
            benefitType: 'CH33 Housing EDU',
            diaryCode: '608',
            diaryCodeDescription: 'Full C&P Benefit Offset Notifi',
            amountOverpaid: 0,
            amountWithheld: 94.34,
            originalAr: 321.76,
            currentAr: 227.42,
            debtHistory: [
              {
                date: '08/08/2018',
                letterCode: 608,
                description: 'Full C&P Benefit Offset Notifi',
              },
              {
                date: '07/19/2018',
                letterCode: 100,
                description:
                  'First Demand Letter - Inactive Benefits - Due Process',
              },
            ],
          },
          {
            fileNumber: '796104437',
            payeeNumber: '00',
            personEntitled: 'AJOHNS',
            deductionCode: '71',
            benefitType: 'CH33 Books, Supplies/MISC EDU',
            diaryCode: '100',
            diaryCodeDescription:
              'First Demand Letter - Inactive Benefits - Due Process',
            amountOverpaid: 0,
            amountWithheld: 0,
            originalAr: 166.67,
            currentAr: 120.4,
            debtHistory: [
              {
                date: '10/18/2020',
                letterCode: '100',
                description:
                  'First Demand Letter - Inactive Benefits - Due Process',
              },
            ],
          },
        ],
      },
    });

    // const filteredResponse = data.debts
    //   .filter(debt => approvedDeductionCodes.includes(debt.deductionCode))
    //   .filter(debt => debt.currentAr > 0)
    //   .map((debt, index) => ({ ...debt, id: index }));

    cy.visit(manifest.rootUrl);
  });
  it('Successful API Response', () => {
    cy.get('*[class^="vads-u-font-size--h4"]').should(
      'have.text',
      'What debt do you need help with?',
    );

    cy.injectAxeThenAxeCheck();
  });
});
