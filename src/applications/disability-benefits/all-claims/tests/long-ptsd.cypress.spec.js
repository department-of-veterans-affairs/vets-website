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

    // This longest running test gets separated out; also as of 1/2023 forms
    // 8940 & 4192 are not released to production
    dataSets: ['full-781-781a-8940-test.json'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy),
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'disability_compensation_sync_modern_0781_flow',
              value: false,
            },
          ],
        },
      });
      cy.login(mockUser);
      setup(cy);
    },

    skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
