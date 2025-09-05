import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';
import { setup, pageHooks } from './cypress.helpers';

import formConfig from '../config/form';
import manifest from '../manifest.json';

Cypress.config('waitForAnimations', true);

const prefillData = {
  disability526Enable2024Form4142: true,
};

const requiredPages = pageHooks(cy, { prefillData });

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['maximal-with-2024-4142-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: {
      ...requiredPages,
    },

    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy, { prefillData });
    },

    useWebComponentFields: true,

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
