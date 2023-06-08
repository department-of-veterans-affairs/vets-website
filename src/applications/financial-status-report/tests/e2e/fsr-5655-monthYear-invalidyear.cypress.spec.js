import manifest from '../../manifest.json';
import { navigateToDebtSelection } from './fixtures/helpers';
import mockUser from './fixtures/mocks/mockUser.json';

describe.skip('Month Year Error Renders Successfully', () => {
  before(() => {
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

    cy.visit(manifest.rootUrl);
  });
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('Successfully Navigate to Form Field', () => {
    navigateToDebtSelection();

    cy.get(':nth-child(3) > .vads-u-margin-top--2 > .usa-button').click({
      waitforanimations: true,
    });

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click({ waitforanimations: true });

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click({ waitforanimations: true });

    cy.get('#root_questions_vetIsEmployedYes').click({
      waitforanimations: true,
    });

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click({ waitforanimations: true });

    // input year in field
    cy.get('#errorable-number-input-1').type('2032');

    // input month in field
    cy.get('#errorable-select-2').select('January');

    cy.get('.float-left').click({ waitforanimations: true });

    cy.get(':nth-child(3) > .input-error-date').contains(
      'Please enter a year between 1900 and',
    );
  });
});
