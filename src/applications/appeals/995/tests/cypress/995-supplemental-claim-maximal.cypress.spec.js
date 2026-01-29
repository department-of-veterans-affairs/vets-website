/**
 * E2E test for supplemental claim on 995 form (maximal/comprehensive test case).
 */
import path from 'path';
import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { setupPerTest, pageHooks } from './995.cypress.helpers';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['pre-api-comprehensive-test'],
    fixtures: {
      data: path.join(__dirname, '..', 'fixtures', 'data'),
      mocks: path.join(__dirname, '..', 'fixtures', 'mocks'),
    },
    pageHooks,
    setupPerTest,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
