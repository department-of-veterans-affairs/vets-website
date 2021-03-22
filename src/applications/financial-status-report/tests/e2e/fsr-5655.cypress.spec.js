import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['negativeResponse'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },
    // setupPerTest: () => {
    //   // Log in if the form requires an authenticated session.
    //   cy.login();
    //   cy.route('POST', formConfig.submitUrl, { status: 200 });
    // },
    pageHooks: {
      introduction: () => {
        // Hit the start button
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
      },
    },
    // skip: true, // disable test until FSR is in production
  },
  manifest,
  formConfig,
);

testForm(testConfig);
