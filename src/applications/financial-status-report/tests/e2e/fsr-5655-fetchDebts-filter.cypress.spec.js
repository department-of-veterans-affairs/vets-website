import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import { WIZARD_STATUS } from '../../wizard/constants';

describe(`Fetch Debts Successfully and Filter Out Invalid Debt`, () => {
  Cypress.config({ requestTimeout: 10000 });

  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
        ],
      },
    }).as('features');

    cy.intercept('GET', '/v0/debts*', {
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
        {
          fileNumber: '796104437',
          payeeNumber: '00',
          personEntitled: 'AJHONS',
          deductionCode: '00', // Not approved code, this record will be filtered out of displayed results
          benefitType: 'CH33 Housing EDU',
          diaryCode: '608',
          diaryCodeDescription: 'Full C&P Benefit Offset Notifi',
          amountOverpaid: 0,
          amountWithheld: 100.01,
          originalAr: 321.76,
          currentAr: 227.42,
          debtHistory: [
            {
              date: '08/11/2018',
              letterCode: 608,
              description: 'Full C&P Benefit Offset Notifi',
            },
            {
              date: '07/15/2018',
              letterCode: 100,
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
      ],
    });

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

    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);

    cy.login(mockUser);
    cy.intercept('GET', '/v0/user?*', mockUser);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.visit(manifest.rootUrl);
    cy.wait('@features');
  });

  it('Successful API Response', () => {
    cy.get('a.vads-c-action-link--green')
      .first()
      .click({ waitForAnimations: true });

    cy.location('pathname').should(
      'eq',
      `/manage-va-debt/request-debt-help-form-5655/veteran-information`,
    );
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click({ waitForAnimations: true });

    cy.get('[data-testid="debt-selection-checkbox"]').should('have.length', 2);

    cy.injectAxeThenAxeCheck();
  });
});
