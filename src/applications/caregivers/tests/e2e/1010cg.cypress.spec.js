import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
// import featureToggleMocks from './fixtures/mocks/feature-toggles.json';
// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

const veteranLabel = `Enter Veteran's or service member\u2019s full name`;
const primaryLabel = 'Enter Primary Family Caregiver\u2019s full name';
// const secondaryOneLabel = 'Enter Secondary Family Caregiver\u2019s full name';
// const secondaryTwoLabel =
//   'Enter Secondary Family Caregiver\u2019s (2) full name';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['minimal.json'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      setup: () => {
        cy.route('GET', '/v0/feature_toggles*', 'fx:mocks/feature-toggles');
      },
      introduction: () => {
        // Hit the start button
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();

        // Click past the ITF message
        cy.findByText(/continue/i, { selector: 'button' }).click();
      },
      'review-and-submit': () => {
        // sign signature as veteran
        cy.get(`[data-test-id="${veteranLabel}-signature-input"]`)
          .find('input')
          .first()
          .type('Micky Mouse');

        // check  checkbox as a veteran
        cy.get(`[data-test-id="${veteranLabel}-signature-input"]`)
          .find('[type="checkbox"]')
          .check();

        // sign signature as primary caregiver
        cy.get(`[data-test-id="${primaryLabel}-signature-input"]`)
          .find('input')
          .first()
          .type('Mini Mouse');

        // check  checkbox as primary caregiver
        cy.get(`[data-test-id="${primaryLabel}-signature-input"]`)
          .find('[type="checkbox"]')
          .check();
      },
    },

    // disable all tests until 1010CG is in production
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
