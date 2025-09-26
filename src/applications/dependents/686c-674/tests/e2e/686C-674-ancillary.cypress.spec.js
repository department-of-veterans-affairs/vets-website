import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockVaFileNumber from './fixtures/va-file-number.json';
import user from './user.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: [
      'ancillary-flows',
      'add-child-report-divorce',
      'spouse-report-divorce',
      'report-married-child-report-student-left-school',
      'report-death',
    ],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      cy.login(user);
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'vaDependentsV2',
              value: true,
            },
            {
              name: 'vaDependentsNetWorthAndPension',
              value: false,
            },
          ],
        },
      });
      cy.intercept('POST', '/v0/claim_attachments', {
        data: {
          attributes: {
            confirmationCode: '5',
          },
        },
      });
      cy.intercept(
        'GET',
        '/v0/profile/valid_va_file_number',
        mockVaFileNumber,
      ).as('mockVaFileNumber');
      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/686C-674-V2', testData);
        cy.intercept('PUT', 'v0/in_progress_forms/686C-674-V2', testData);
      });
      cy.intercept('POST', '/v0/dependents_applications', {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2020-11-12',
        attributes: {
          guid: '123fake-submission-id-567',
        },
      }).as('submitApplication');
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.wait('@mockVaFileNumber');
          cy.clickStartForm();
        });
      },

      'veteran-address': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get(
            'select#options[name="root_veteranContactInformation_veteranAddress_state"]',
            { timeout: 1000 },
          )
            .should('be.visible')
            .should('not.be.disabled');
          cy.get(
            'select#options[name="root_veteranContactInformation_veteranAddress_state"]',
          ).select('AL');
          cy.clickFormContinue();
        });
      },

      'current-marriage-information/location-of-marriage': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get(
            'select#options[name="root_currentMarriageInformation_location_country"]',
            { timeout: 1000 },
          )
            .should('be.visible')
            .should('not.be.disabled');
          cy.get(
            'select#options[name="root_currentMarriageInformation_location_country"]',
          ).select('AUS');
          cy.clickFormContinue();
        });
      },

      'current-marriage-information/spouse-address': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get(
            'select#options[name="root_doesLiveWithSpouse_address_state"]',
            { timeout: 1000 },
          )
            .should('be.visible')
            .should('not.be.disabled');
          cy.get(
            'select#options[name="root_doesLiveWithSpouse_address_state"]',
          ).select('AL');
          cy.clickFormContinue();
        });
      },

      '686-report-marriage-of-child/0/date-child-married': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.clickFormContinue();
        });
      },

      'report-child-stopped-attending-school/0/date-child-left-school': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillPage();
          cy.clickFormContinue();
        });
      },

      '686-stepchild-no-longer-part-of-household/0/child-address': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('select#options[name="root_address_state"]', { timeout: 1000 })
            .should('be.visible')
            .should('not.be.disabled');
          cy.get('select#options[name="root_address_state"]').select('AL');
          cy.clickFormContinue();
        });
      },

      '686-report-dependent-death/0/date-of-death': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.clickFormContinue();
        });
      },

      '686-report-add-child/introduction': ({ afterHook }) => {
        afterHook(() => {
          cy.clickFormContinue();
        });
      },

      '686-report-add-child/summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-radio-option[value="N"]').click();

          cy.clickFormContinue();
        });
      },

      'add-child/0/additional-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_doesChildLiveWithYouYes').click();
          cy.clickFormContinue();
        });
      },

      '686-stepchild-no-longer-part-of-household/0/date-child-left-household': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get(
            'select#options[name="root_dateStepchildLeftHouseholdMonth"]',
            { timeout: 1000 },
          )
            .should('be.visible')
            .should('not.be.disabled');
          cy.get(
            'select#options[name="root_dateStepchildLeftHouseholdMonth"]',
          ).select('2');
          cy.clickFormContinue();
        });
      },

      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-text-input')
            .shadow()
            .find('input')
            .type('John Doe');

          cy.get('va-checkbox')
            .shadow()
            .find('input[type="checkbox"]')
            .check({ force: true });

          cy.clickFormContinue();
        });
      },
    },
    // skip: Cypress.env('CI'),
  },

  manifest,
  formConfig,
);

testForm(testConfig);
