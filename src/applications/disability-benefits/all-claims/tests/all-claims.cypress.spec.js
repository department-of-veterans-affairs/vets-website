import path from 'path';
import moment from 'moment';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/document-upload.json';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { mockItf } from './all-claims.cypress.helpers';
import {
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../constants';

const todayPlus120 = moment()
  .add(120, 'days')
  .format('YYYY-M-D')
  .split('-');

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: [
      'full-781-781a-8940-test.json',
      'maximal-test',
      'maximal-bdd-test',
      'minimal-test',
      'minimal-bdd-test',
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
        cy.get('@testData').then(data => {
          if (data['view:isBddData']) {
            window.sessionStorage.setItem(
              SAVED_SEPARATION_DATE,
              todayPlus120.join('-'),
            );
            cy.get('[type="radio"][value="bdd"]').check({
              waitForAnimations: true,
            });
            cy.get('select[name="discharge-dateMonth"]').select(
              todayPlus120[1],
            );
            cy.get('select[name="discharge-dateDay"]').select(todayPlus120[2]);
            cy.get('input[name="discharge-dateYear"]')
              .clear()
              .type(todayPlus120[0]);
          } else {
            cy.get('[type="radio"][value="appeals"]').check({
              waitForAnimations: true,
            });
            cy.get('[type="radio"][value="file-claim"]').check({
              waitForAnimations: true,
            });
          }
          // close wizard & render intro page content
          cy.get('.va-button-primary').click({ waitForAnimations: true });
          // Start form
          cy.findAllByText(/start/i, { selector: 'button' })
            .first()
            .click();
        });
      },

      'veteran-information': () => {
        // Click past the ITF message
        cy.findByText(/continue/i, { selector: 'button' }).click();
      },

      'review-veteran-details/military-service-history': () => {
        cy.get('@testData').then(data => {
          cy.fillPage();
          if (data['view:isBddData']) {
            cy.get('select[name$="_dateRange_toMonth"]').select(
              todayPlus120[1],
            );
            cy.get('select[name$="_dateRange_toDay"]').select(todayPlus120[2]);
            cy.get('input[name$="_dateRange_toYear"]')
              .clear()
              .type(todayPlus120[0]);
          }
        });
      },

      'review-veteran-details/separation-location': () => {
        cy.get('@testData').then(data => {
          cy.get(
            'input[name="root_serviceInformation_separationLocation"]',
          ).type(data.serviceInformation.separationLocation.label);
        });
      },

      'disabilities/rated-disabilities': () => {
        cy.get('@testData').then(data => {
          data.ratedDisabilities.forEach((disability, index) => {
            if (disability['view:selected']) {
              cy.get(`input[name="root_ratedDisabilities_${index}"]`).click();
            }
          });
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
        });
      },
    },

    setupPerTest: () => {
      cy.login();

      cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);

      // `mockItf` is not a fixture; it can't be loaded as a fixture
      // because fixtures don't evaluate JS.
      cy.intercept('GET', '/v0/intent_to_file', mockItf);

      cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress);

      cy.intercept(
        'GET',
        '/v0/disability_compensation_form/separation_locations',
        mockLocations,
      );

      cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);

      cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload);

      cy.intercept(
        'POST',
        '/v0/disability_compensation_form/submit_all_claim',
        mockSubmit,
      );

      // Stub submission status for immediate transition to confirmation page.
      cy.intercept(
        'GET',
        '/v0/disability_compensation_form/submission_status/*',
        '',
      );

      // Pre-fill with the expected ratedDisabilities,
      // but without view:selected, since that's not pre-filled
      cy.get('@testData').then(data => {
        window.sessionStorage.removeItem(WIZARD_STATUS);
        window.sessionStorage.removeItem(FORM_STATUS_BDD);
        const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
          ({ 'view:selected': _, ...obj }) => obj,
        );

        cy.intercept('GET', MOCK_SIPS_API, {
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

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
