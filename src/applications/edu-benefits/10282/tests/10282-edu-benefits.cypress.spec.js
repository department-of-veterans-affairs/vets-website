import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    // Rename and modify the test data as needed.
    dataSets: ['minimal.json', 'maximal.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          //   cy.findByText('Start your Application').click();
          cy.get('a.va-link--primary')
            .first()
            .click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          //   cy.findByText('Start your Application').click();
          cy.get('va-text-input')
            .shadow()
            .find('input')
            .type('Jane Doe');
          cy.get(`va-checkbox`)
            .shadow()
            .find('input')
            .check({ force: true });

          cy.findAllByText(/submit/i, { selector: 'button' })
            .first()
            .click();
        });
      },
    },

    setupPerTest: () => {
      // Log in if the form requires an authenticated session.
      // cy.login();
      //   cy.intercept('POST', formConfig.submitUrl, { status: 200 });
      // cy.route({
      //     method: 'POST',
      //     url: '/v0/contact_us/inquiries',
      //     status: 200,
      //     response: {
      //       confirmationNumber: '000123456000A',
      //       dateSubmitted: '10-30-2020',
      //     },
      //   });
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
