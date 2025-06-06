import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { pageHooks, setupBasicTest } from './utils';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['requiredOnly'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    setupPerTest: () => setupBasicTest(),
    pageHooks,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
