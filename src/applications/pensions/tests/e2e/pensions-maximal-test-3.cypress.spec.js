import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import pagePaths from './pagePaths';
import maximalData from './fixtures/data/maximal-test.json';

import { chapter12 } from './fixtures/data/maximal-data-parts';

import pageHooks from './helpers/pageHooks';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import cypressSetup from './cypress.setup';

const START = `/${pagePaths.age}`; // Start at chapter 3
const STOP = `/${pagePaths.maritalStatus}`; // Stop at chapter 4

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Pensions',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [{ title: 'maximal-test-chapter-3', data: maximalData }],
    stopTestAfterPath: STOP,
    pageHooks: pageHooks(START),
    setupPerTest: () => {
      cypressSetup({
        authenticated: true,
        isEnabled: true,
        returnUrl: START,
        prefill: chapter12,
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
