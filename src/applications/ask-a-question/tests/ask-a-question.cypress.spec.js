import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

// `appName`, `arrayPages`, and `rootUrl` don't need to be explicitly defined.
const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    fixtures: {
      data: path.join(__dirname, 'data'),
    },
    pageHooks: {
      introduction: () => {
        cy.findAllByText(/start.+without signing in/i)
          .first()
          .click();
      },
      topic: () => {
        cy.fillPage();
        cy.findAllByText(/continue/i)
          .first()
          .click();
      },
      'contact-information': () => {
        cy.fillPage();
        cy.findAllByText(/continue/i)
          .first()
          .click();
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
