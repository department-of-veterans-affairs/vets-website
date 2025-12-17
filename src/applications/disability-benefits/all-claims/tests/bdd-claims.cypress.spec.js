import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    useWebComponentFields: true,

    dataSets: ['minimal-bdd-test', 'maximal-bdd-test'],

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
              { name: 'disability_526_show_confirmation_review', value: true },
            ],
          },
        },
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
