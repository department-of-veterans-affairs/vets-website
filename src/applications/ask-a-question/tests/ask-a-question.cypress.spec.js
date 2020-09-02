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
    },
    skip: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
