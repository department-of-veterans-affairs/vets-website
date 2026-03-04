import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { fillStatementOfTruthAndSubmit, setupBasicTest } from './utils';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['test-data'],
    fixtures: { data: path.join(__dirname, 'fixtures/data') },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => cy.clickStartForm());
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => fillStatementOfTruthAndSubmit());
      },
    },

    setupPerTest: () => setupBasicTest(),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
