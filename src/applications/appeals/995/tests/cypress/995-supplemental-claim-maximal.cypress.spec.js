/**
 * E2E test for supplemental claim on 995 form (maximal/comprehensive test case).
 */
import path from 'path';
import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { setupPerTest, pageHooks } from './995.cypress.helpers';
import { NOV_2025_REDESIGN_TOGGLE, TOGGLE_KEY } from '../../constants';

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
    setupPerTest: data => {
      const toggles = [
        {
          name: NOV_2025_REDESIGN_TOGGLE,
          value: false,
        },
        {
          name: TOGGLE_KEY,
          value: false,
        },
      ];
      setupPerTest(data, toggles);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
