import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const veteranLabel = `Enter Veteran's or service member\u2019s full name`;
const primaryLabel = 'Enter Primary Family Caregiver\u2019s full name';
const secondaryOneLabel = 'Enter Secondary Family Caregiver\u2019s full name';
const secondaryTwoLabel =
  'Enter Secondary Family Caregiver\u2019s (2) full name';

const testSecondaryTwo = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['twoSecondaryCaregivers.json'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    setupPerTest: () => {
      cy.route('GET', '/v0/feature_toggles?*', 'fx:mocks/feature-toggles');
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

        // check  checkbox as secondaryOne caregiver
        cy.get(`[data-test-id="${primaryLabel}-signature-input"]`)
          .find('[type="checkbox"]')
          .check();

        // sign signature as secondaryOne caregiver
        cy.get(`[data-test-id="${secondaryOneLabel}-signature-input"]`)
          .find('input')
          .first()
          .type('George Geef Goofus');

        // check  checkbox as primary caregiver
        cy.get(`[data-test-id="${secondaryOneLabel}-signature-input"]`)
          .find('[type="checkbox"]')
          .check();

        // sign signature as secondaryTwo caregiver
        cy.get(`[data-test-id="${secondaryTwoLabel}-signature-input"]`)
          .find('input')
          .first()
          .type('Donald Duck');

        // check  checkbox as secondaryTwo caregiver
        cy.get(`[data-test-id="${secondaryTwoLabel}-signature-input"]`)
          .find('[type="checkbox"]')
          .check();

        cy.route({
          method: 'POST',
          url: '/v0/caregivers_assistance_claims',
          status: 200,
          response: {
            body: {
              data: {
                id: '',
                type: 'form1010cg_submissions',
                attributes: {
                  confirmationNumber: 'aB935000000F3VnCAK',
                  submittedAt: '2020-08-06T19:18:11+00:00',
                },
              },
            },
          },
        });
      },
    },

    // disable all tests until 1010CG is in production
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testSecondaryTwo);
