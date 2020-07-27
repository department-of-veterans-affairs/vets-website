import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['minimal.json'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
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
      'review-and-submit': () => {
        cy.get('vet-signature-input').first();
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
