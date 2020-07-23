import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['full-781-781a-8940-test.json'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      introduction: () => {
        // Hit the start button
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();

        // Click past the ITF message
        cy.findByText(/continue/i, { selector: 'button' }).click();
      },
    },

    setupPerTest: () => {
      cy.route('GET', '/v0/feature_toggles*', 'fx:mocks/feature-toggles');

      cy.route('PUT', '/v0/in_progress_forms/*', 'fx:mocks/in-progress-forms');

      cy.route(
        'GET',
        '/v0/ppiu/payment_information',
        'fx:mocks/payment-information',
      );

      cy.route(
        'POST',
        '/v0/upload_supporting_evidence',
        'fx:mocks/document-upload',
      );

      cy.route(
        'POST',
        '/v0/disability_compensation_form/submit_all_claim',
        'fx:mocks/application-submit',
      );

      // Stub submission status for immediate transition to confirmation page.
      cy.route(
        'GET',
        '/v0/disability_compensation_form/submission_status/*',
        '',
      );
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
