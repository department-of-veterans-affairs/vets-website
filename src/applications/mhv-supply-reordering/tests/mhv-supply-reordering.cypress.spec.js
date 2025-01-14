import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

import mockApiResponses from '../mocks';
import userResponse from '../mocks/user';

const userData = userResponse['GET /v0/user'];

// example testConfig: https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/platform/testing/e2e/cypress/support/form-tester#sample-code

// dataSets - sample data to be entered into the form, located: ./fixtures/data/*.json

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => cy.findByText(/^Start a new order$/).click());
      },
      chooseSupplies: () => {
        cy.findByRole('checkbox', { name: 'root_chosenSupplies_6584' }).check();
      },
    },
    setupPerTest: () => {
      Object.entries(mockApiResponses).forEach(([request, response]) => {
        cy.intercept(
          request, // .endsWith('(.*)') ? request.replace('(.*)', '*') : request, // account for the difference in how mocker-api and cypress handle wildcards
          response,
        );
      });
      cy.login(userData);
    },
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
