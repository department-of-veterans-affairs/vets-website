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

    // 'full-781-781a-8940-test.json' moved to long-ptsd.cypress.spec.js
    // to help balance out CI
    dataSets: [
      'minimal-skip-781.json',
      'upload-781-781a-8940-test.json',
      'secondary-new-test.json',
    ],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy);
    },

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
