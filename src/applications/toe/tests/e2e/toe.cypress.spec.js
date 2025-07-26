import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { submissionForm } from '../fixtures/data/form-submission-test-data';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [
      {
        title: 'toe-happy-path',
        data: submissionForm.data,
      },
    ],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('a.vads-c-action-link--green')
            .first()
            .click();
        });
      },
    },
    setupPerTest: () => {
      cy.login();
      cy.intercept('POST', formConfig.submitUrl, { statusCode: 200 });
    },
    _13647Exception: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
