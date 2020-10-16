import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../form/form';
import manifest from '../../manifest.json';

// `appName`, `arrayPages`, and `rootUrl` don't need to be explicitly defined.
const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    fixtures: {
      data: path.join(__dirname, 'data'),
    },
    skip: false,
    setupPerTest: () => {
      cy.route({
        method: 'POST',
        url: '/v0/ask/asks',
        status: 200,
        response: {
          body: '200 ok',
        },
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
