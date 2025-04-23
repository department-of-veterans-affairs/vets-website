import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import pagePaths from './pagePaths';
import maximalData from './fixtures/data/maximal-test.json';

import { chapter12, chapter3 } from './fixtures/data/maximal-data-parts';

import pageHooks from './helpers/pageHooks';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import cypressSetup from './cypress.setup';

const START = `/${pagePaths.maritalStatus}`; // Start at chapter 4
const STOP = `/${pagePaths.totalNetWorth}`; // Stop at chapter 5

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Pensions',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [{ title: 'maximal-test-chapter-4', data: maximalData }],
    stopTestAfterPath: STOP, // Stop at chapter 5
    pageHooks: pageHooks(START),
    setupPerTest: () => {
      cypressSetup({
        authenticated: true,
        isEnabled: true,
        returnUrl: START,
        prefill: { ...chapter12, ...chapter3 },
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
