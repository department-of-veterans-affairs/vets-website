import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import pagePaths from './pagePaths';
import maximalData from './fixtures/data/maximal-test.json';

import pageHooks from './helpers/pageHooks';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import cypressSetup from './cypress.setup';

const START = '/'; // Start at chapter 1
const STOP = `/${pagePaths.age}`; // Stop at chapter 3

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Pensions',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [{ title: 'maximal-test-chapter-1-2', data: maximalData }],
    stopTestAfterPath: STOP,
    pageHooks: pageHooks(START),
    setupPerTest: () => {
      cypressSetup({
        authenticated: true,
        isEnabled: true,
        returnUrl: START,
        prefill: {},
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
