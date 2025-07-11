import path from 'path';

import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import { setupPerTest, pageHooks } from './995.cypress.helpers';

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
    setupPerTest: data => {
      const toggles = [
        {
          name: 'decision_reviews_4142_banner',
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
