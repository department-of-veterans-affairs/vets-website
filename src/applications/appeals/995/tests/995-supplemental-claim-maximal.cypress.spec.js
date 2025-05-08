import path from 'path';

import testForm from '@department-of-veterans-affairs/platform-testing/form-tester';
import { createTestConfig } from '@department-of-veterans-affairs/platform-testing/form-tester/utilities';

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
    setupPerTest,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
