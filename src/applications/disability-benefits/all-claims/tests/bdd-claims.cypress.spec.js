import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig as _createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

const createTestConfig = ({ dataSets, features }) =>
  _createTestConfig(
    {
      dataPrefix: 'data',
      useWebComponentFields: true,
      dataSets,

      fixtures: {
        data: path.join(__dirname, 'fixtures', 'data'),
      },

      pageHooks: pageHooks(cy, {
        showConfirmationReview: true,
      }),
      setupPerTest: () => {
        cy.login(mockUser);
        setup(cy, {
          toggles: {
            data: {
              type: 'feature_toggles',
              features: [
                { name: 'show526Wizard', value: true },
                {
                  name: 'disability_526_show_confirmation_review',
                  value: true,
                },
                ...features,
              ],
            },
          },
        });
      },
    },
    manifest,
    formConfig,
  );

const deprecratedTestConfig = createTestConfig({
  dataSets: [
    'minimal-bdd-test.deprecated.json',
    'maximal-bdd-test.deprecated.json',
  ],
  features: [],
});

// TODO: Cleanup once feature flagging is finished. Including `_createTestConfig`.
testForm(deprecratedTestConfig);

const testConfig = createTestConfig({
  dataSets: ['minimal-bdd-test', 'maximal-bdd-test'],
  features: [{ name: 'disability_526_extra_bdd_pages_enabled', value: true }],
});

testForm(testConfig);
