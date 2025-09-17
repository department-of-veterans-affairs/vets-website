import path from 'path';

import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import { pageHooks } from './995.cypress.helpers';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['maximal-test'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    pageHooks,
<<<<<<< HEAD
    setupPerTest: data => {
      const toggles = [];
      setupPerTest(data, toggles);
    },
=======
>>>>>>> 299a276925 (Fixing unit and Cypress tests)
  },
  manifest,
  formConfig,
);

testForm(testConfig);
