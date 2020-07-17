import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { mockItf } from './all-claims.cypress.helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: [
      'full-781-781a-8940-test.json',
      'maximal-test',
      'minimal-test',
      'newOnly-test',
      'secondary-new-test.json',
      'upload-781-781a-8940-test.json',
    ],

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

      'disabilities/rated-disabilities': () => {
        cy.get('@testData').then(data => {
          data.ratedDisabilities.forEach((disability, index) => {
            if (disability['view:selected']) {
              cy.get(`input[name="root_ratedDisabilities_${index}"]`).click();
            }
          });
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },

      'payment-information': () => {
        cy.get('@testData').then(data => {
          if (data['view:bankAccount']) {
            cy.get('form.rjsf').then($form => {
              const editButton = $form.find('.usa-button-primary.edit-button');
              if (editButton) editButton.click();
            });

            cy.fillPage();
            cy.findByText(/save/i, { selector: 'button' }).click();
          }

          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
    },

    setupPerTest: () => {
      cy.login();

      cy.route('GET', '/v0/feature_toggles*', 'fx:mocks/feature-toggles');

      // `mockItf` is not a fixture; it can't be loaded as a fixture
      // because fixtures don't evaluate JS.
      cy.route('GET', '/v0/intent_to_file', mockItf);

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

      // Pre-fill with the expected ratedDisabilities,
      // but without view:selected, since that's not pre-filled
      cy.get('@testData').then(data => {
        const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
          ({ 'view:selected': _, ...obj }) => obj,
        );

        cy.route('GET', 'v0/in_progress_forms/21-526EZ', {
          formData: {
            veteran: {
              primaryPhone: '4445551212',
              emailAddress: 'test2@test1.net',
            },
            disabilities: sanitizedRatedDisabilities,
          },
          metadata: {
            version: 0,
            prefill: true,
            returnUrl: '/veteran-information',
          },
        });
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
