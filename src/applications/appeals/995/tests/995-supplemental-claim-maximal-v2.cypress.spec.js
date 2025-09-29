import path from 'path';

import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import { setupPerTest, pageHooks } from './995.cypress.helpers';
import { SC_NEW_FORM_TOGGLE } from '../constants';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['maximal-test-v2'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    pageHooks,
    setupPerTest: data => {
      const toggles = [
        {
          name: SC_NEW_FORM_TOGGLE,
          value: true,
        },
        {
          name: 'scNewForm',
          value: true,
        },
      ];
      setupPerTest(data, toggles);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
