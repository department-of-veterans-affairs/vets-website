import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
// import user from '../fixtures/mocks/user.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    // Rename and modify the test data as needed.
    dataSets: ['no-api-issues', 'minimal-test', 'maximal-test'],

    fixtures: {
      // data: path.join(__dirname, 'fixtures', 'data'),
      // mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
    },
    setupPerTest: () => {
      // cypressSetup();
      // cy.intercept('POST', EVIDENCE_UPLOAD_API, mockUpload);
      // cy.intercept('POST', SUBMIT_URL, mockSubmit);
      // cy.get('@testData').then(data => {
      //   cy.intercept('GET', '/v0/in_progress_forms/10182', mockPrefill);
      //   cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);
      //   cy.intercept('GET', CONTESTABLE_ISSUES_API, {
      //     data: fixDecisionDates(data.contestedIssues, { unselected: true }),
      //   }).as('getIssues');
      // });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
