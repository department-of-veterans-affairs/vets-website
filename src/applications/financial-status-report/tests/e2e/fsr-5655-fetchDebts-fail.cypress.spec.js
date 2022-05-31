import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
// import { deductionCodes } from '../../../debt-letters/const/deduction-codes';

describe('Fetch Debts Unsuccessfully', () => {
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

    cy.intercept('GET', '/v0/debts*', req => {
      req.reply(500, { errors: [] });
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
  it('Unsuccessful API Response', () => {
    cy.get('#start-option-0').click();
    cy.get('#reconsider-option-2').click();
    cy.get('#recipients-option-1').click();
    cy.get('[data-testid="start-button"]').click();

    cy.findAllByText(/start/i, { selector: 'button' })
      .first()
      .click();

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    cy.get('[data-testid="server-error"] > h3').should(
      'have.text',
      'We’re sorry. Something went wrong on our end.',
    );

    cy.injectAxeThenAxeCheck();
  });
});
