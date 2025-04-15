import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

const prefillData = {
  startedFormVersion: '2022',
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['maximal-toxic-exposure-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy, { prefillData }),
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
