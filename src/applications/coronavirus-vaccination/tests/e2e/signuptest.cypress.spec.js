import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: [
        'patient',
      ],
      fixtures: {
        data: path.join(__dirname, 'fixtures', 'data'),
      },

    pageHooks: {
      // Due to automatic path resolution, this URL expands to:
      // '/some-form-app-url/introduction'. Either format can be used.
      '/health-care/covid-19-vaccine/stay-informed/': ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/Continue without signing in/i, { selector: 'a' })
            .first()
            .click();
        });
      },
    },

    setupPerTest: () => {
      cy.route({
        method: 'GET',
        url: '/v0/endpoint',
        response: { body: 'mock body' },
      });

      cy.route({
        method: 'POST',
        url: '/v0/endpoint',
        status: 200,
      })
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);