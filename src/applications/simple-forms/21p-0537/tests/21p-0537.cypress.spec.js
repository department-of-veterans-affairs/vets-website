// Test file for form 21p-0537 (Marital Status Questionnaire for DIC Recipients)

import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
// Import helper functions for web component interaction
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  selectYesNoWebComponent,
  fillTextWebComponent,
  fillFullNameWebComponentPattern,
  fillDateWebComponentPattern,
  reviewAndSubmitPageFlow,
} from '../../shared/tests/e2e/helpers';

import formConfig from '../config/form';
import manifest from '../manifest.json';

// Mock data
import mockUser from './e2e/fixtures/mocks/user.json';
import mockSipGet from './e2e/fixtures/mocks/sip-get.json';
import mockSipPut from './e2e/fixtures/mocks/sip-put.json';
import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures'),
    dataSets: [
      'test-data-complete',
      'test-data-not-remarried',
      'test-data-over-57',
      'test-data-terminated',
      'test-data-va-file-only',
      'test-data',
    ],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      'veteran-info/name': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.injectAxeThenAxeCheck();
            fillFullNameWebComponentPattern(
              'veteranFullName',
              data.veteranFullName,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'veteran-info/identifier': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'veteranIdentification_ssn',
              data.veteranIdentification.ssn,
            );
            fillTextWebComponent(
              'veteranIdentification_vaFileNumber',
              data.veteranIdentification.vaFileNumber,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'screening/remarriage-status': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent('hasRemarried', data.hasRemarried);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'marital/marriage-info': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillDateWebComponentPattern(
              'remarriage_dateOfMarriage',
              data.remarriage.dateOfMarriage,
            );
            fillFullNameWebComponentPattern(
              'remarriage_spouseName',
              data.remarriage.spouseName,
            );
            fillDateWebComponentPattern(
              'remarriage_spouseDateOfBirth',
              data.remarriage.spouseDateOfBirth,
            );
            fillTextWebComponent(
              'remarriage_ageAtMarriage',
              data.remarriage.ageAtMarriage,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'marital/spouse-veteran': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'remarriage_spouseIsVeteran',
              data.remarriage.spouseIsVeteran,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'marital/spouse-veteran-id': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'remarriage_spouseVeteranId_vaFileNumber',
              data.remarriage.spouseVeteranId.vaFileNumber,
            );
            fillTextWebComponent(
              'remarriage_spouseVeteranId_ssn',
              data.remarriage.spouseVeteranId.ssn,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'marital/termination-status': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'remarriage_hasTerminated',
              data.remarriage.hasTerminated,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'marital/termination-details': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillDateWebComponentPattern(
              'remarriage_terminationDate',
              data.remarriage.terminationDate,
            );
            fillTextWebComponent(
              'remarriage_terminationReason',
              data.remarriage.terminationReason,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'marital/marriage-recognition': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(_data => {
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'contact/phone-email': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'recipient_phone_daytime',
              data.recipient.phone.daytime,
            );
            fillTextWebComponent(
              'recipient_phone_evening',
              data.recipient.phone.evening,
            );
            fillTextWebComponent('recipient_email', data.recipient.email);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(_data => {
            reviewAndSubmitPageFlow(
              { first: 'Jane', middle: 'M', last: 'Spouse' },
              'Submit form',
            );
          });
        });
      },
    },
    setupPerTest: () => {
      // Mock API endpoints
      cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);

      // Mock the form submission endpoint
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(_data => {
          expect(req.body).to.have.property('recipient');
          expect(req.body).to.have.property('remarriage');
          expect(req.body).to.have.property('veteran');
        });
        // Mock successful response
        req.reply({ status: 200 });
      });

      // Include shadow DOM in commands
      cy.config('includeShadowDom', true);
      cy.config('retries', { runMode: 0 });

      cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('GET', '/v0/in_progress_forms/21p-0537', mockSipGet);
      cy.intercept('PUT', '/v0/in_progress_forms/21p-0537', mockSipPut);

      cy.login(mockUser);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
