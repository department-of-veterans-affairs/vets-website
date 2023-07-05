import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import get from 'platform/utilities/data/get';

import formConfig from '../config/form';
import manifest from '../manifest.json';

// Array item autofill gets triggered and fails on additional sources fields, so
// we script specific steps in page hooks to fill out the pages that have them.
const fillAdditionalSources = ({ additionalSources }) => {
  const { name, amount } = additionalSources[0];
  cy.findByText(/add another/i).click();
  cy.findByLabelText(/source/i).type(name);
  cy.findByLabelText(/amount/i).type(amount);
  cy.findByText(/^Save$/).click();
};

const fillNetWorth = data => {
  const { bank, interestBank, ira, stocks, realProperty } = data;

  cy.findByLabelText(/cash/i)
    .clear()
    .type(bank);

  cy.findByLabelText(/^interest bearing/i)
    .clear()
    .type(interestBank);

  cy.findByLabelText(/iras/i)
    .clear()
    .type(ira);

  cy.findByLabelText(/stocks/i)
    .clear()
    .type(stocks);

  cy.findByLabelText(/real property/i)
    .clear()
    .type(realProperty);

  fillAdditionalSources(data);
};

const fillMonthlyIncome = data => {
  const {
    socialSecurity,
    civilService,
    railroad,
    blackLung,
    serviceRetirement,
    ssi,
  } = data;

  cy.findByLabelText(/social security/i)
    .clear()
    .type(socialSecurity);

  cy.findByLabelText(/civil service/i)
    .clear()
    .type(civilService);

  cy.findByLabelText(/railroad/i)
    .clear()
    .type(railroad);

  cy.findByLabelText(/black lung/i)
    .clear()
    .type(blackLung);

  cy.findByLabelText(/service retirement/i)
    .clear()
    .type(serviceRetirement);

  cy.findByLabelText(/supplemental security/i)
    .clear()
    .type(ssi);

  fillAdditionalSources(data);
};

const fillExpectedIncome = data => {
  const { salary, interest } = data;

  cy.findByLabelText(/salary/i)
    .clear()
    .type(salary);

  cy.findByLabelText(/interest/i)
    .clear()
    .type(interest);

  fillAdditionalSources(data);
};

// Map each financial disclosure page to the object path for its data.
const financialDisclosureDataPaths = {
  'financial-disclosure/net-worth': 'netWorth',
  'financial-disclosure/net-worth/spouse': 'spouseNetWorth',
  'financial-disclosure/net-worth/dependents/0': 'dependents[0].netWorth',
  'financial-disclosure/net-worth/dependents/1': 'dependents[1].netWorth',

  'financial-disclosure/monthly-income': 'monthlyIncome',
  'financial-disclosure/monthly-income/spouse': 'spouseMonthlyIncome',
  'financial-disclosure/monthly-income/dependents/0':
    'dependents[0].monthlyIncome',
  'financial-disclosure/monthly-income/dependents/1':
    'dependents[1].monthlyIncome',

  'financial-disclosure/expected-income': 'expectedIncome',
  'financial-disclosure/expected-income/spouse': 'spouseExpectedIncome',
  'financial-disclosure/expected-income/dependents/0':
    'dependents[0].expectedIncome',
  'financial-disclosure/expected-income/dependents/1':
    'dependents[1].expectedIncome',
};

// Map the type of financial disclosure page to the appropriate fill function.
const financialDisclosureFillFunctions = {
  'net-worth': fillNetWorth,
  'monthly-income': fillMonthlyIncome,
  'expected-income': fillExpectedIncome,
};

// Create page hooks that use the appropriate fill function and data.
const financialDisclosurePageHooks = Object.fromEntries(
  Object.entries(financialDisclosureDataPaths).map(([pagePath, dataPath]) => {
    const match = pagePath.match(/financial-disclosure\/([^/]+)\/?.*/);

    if (!match) {
      throw Error(`Unexpected financial disclosure page path: ${pagePath}`);
    }

    const [, pageHookType] = match;
    const fillFunction = financialDisclosureFillFunctions[pageHookType];

    if (!fillFunction) {
      throw Error(
        `Unexpected financial disclosure page hook type: ${pageHookType}`,
      );
    }
    return [
      pagePath,
      () => {
        cy.get('@testData').then(testData => {
          const data = get(dataPath, testData);
          fillFunction(data);
        });
      },
    ];
  }),
);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'schema'),

    dataSets: ['maximal-test'],

    pageHooks: {
      introduction: () => {
        cy.contains('Start the pension application').click();
      },

      'household/marriage-info': () => {
        cy.fillPage();

        cy.get('@testData').then(data => {
          cy.findByLabelText(/how many times/i).type(data.marriages.length);
        });
      },

      'household/spouse-info': () => {
        cy.fillPage();

        cy.get('@testData').then(data => {
          cy.findByLabelText(/how many times/i).type(
            data.spouseMarriages.length + 1,
          );
        });
      },

      ...financialDisclosurePageHooks,
    },

    setupPerTest: () => {
      cy.login();

      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          feature: [],
        },
      });

      cy.intercept('GET', '/v0/pension_claims/*', {
        data: {
          attributes: {
            state: 'success',
          },
        },
      });

      cy.intercept('POST', '/v0/pension_claims', {
        data: {
          attributes: {
            guid: '1234',
            regionalOffice: [],
            confirmationNumber: '123fake-submission-id-456',
            submittedAt: '2021-06-07',
          },
        },
      });

      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/21P-527EZ', testData);
        cy.intercept('PUT', '/v0/in_progress_forms/21P-527EZ', testData);
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
