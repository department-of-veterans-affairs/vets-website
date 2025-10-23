import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../form/form';
import manifest from '../../manifest.json';

// `appName`, `arrayPages`, and `rootUrl` don't need to be explicitly defined.
const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['general-question', 'maximal'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },
    pageHooks: {
      introduction: () => {
        cy.findAllByText(/start.+without signing in/i)
          .first()
          .click();
      },
    },
    skip: true,
    setupPerTest: () => {
      cy.route({
        method: 'POST',
        url: '/v0/contact_us/inquiries',
        status: 200,
        response: {
          confirmationNumber: '000123456000A',
          dateSubmitted: '10-30-2020',
        },
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
