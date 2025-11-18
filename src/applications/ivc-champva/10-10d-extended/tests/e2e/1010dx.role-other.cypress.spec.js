import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  fillStatementOfTruthAndSubmit,
  setupBasicTest,
  startAsNewUser,
} from './utils';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['other.applicant-child', 'other.applicant-spouse'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => startAsNewUser());
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
