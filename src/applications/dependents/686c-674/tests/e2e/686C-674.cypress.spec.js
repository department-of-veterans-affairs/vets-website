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
    dataSets: ['add-child-add-674', 'spouse-child-all-fields'],
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
          ],
        },
      });
      cy.intercept(
        'GET',
        '/v0/profile/valid_va_file_number',
        mockVaFileNumber,
      ).as('mockVaFileNumber');
      cy.intercept('POST', '/v0/claim_attachments', {
        data: {
          attributes: {
            confirmationCode: '5',
          },
        },
      });
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
          cy.get('va-omb-info')
            .get('div')
            .get('va-button')
            .should('exist');
          cy.get('.help-talk va-telephone:first')
            .contains('800-698-2411')
            .should('have.prop', 'href');
          cy.get('.help-talk va-telephone:last')
            .contains('711')
            .should('have.prop', 'href');
          cy.clickStartForm();
        });
      },

      'veteran-information': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('.progress-box va-telephone')
            .contains('800-827-1000')
            .should('have.prop', 'href');
          cy.clickFormContinue();
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

      'report-674/add-students/0/student-address': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('select#options[name="root_address_state"]', { timeout: 1000 })
            .should('be.visible')
            .should('not.be.disabled');
          cy.get('select#options[name="root_address_state"]').select('CA');
          cy.clickFormContinue();
        });
      },

      'report-674/add-students/0/term-dates': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.clickFormContinue();
        });
      },

      'report-674/add-students/0/previous-term-dates': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.clickFormContinue();
        });
      },

      'report-674/add-students/0/additional-remarks': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.clickFormContinue();
        });
      },

      '686-report-marriage-of-child/0/date-child-married': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.clickFormContinue();
        });
      },

      'report-674/add-students/0/student-marriage-date': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.clickFormContinue();
        });
      },

      'add-child/0': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('@testData').then(data => {
            if (!data.childrenToAdd[0].childStatus.biological) {
              cy.get('#root_childStatus_stepchild').check();
              cy.get('#root_childStatus_biologicalStepchildYes').check();
            }
          });
          cy.clickFormContinue();
        });
      },

      '686-report-add-child/introduction': ({ afterHook }) => {
        afterHook(() => {
          cy.clickFormContinue();
        });
      },
      '686-report-add-child/0/child-address-part-one': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('select#options[name="root_address_state"]', { timeout: 1000 })
            .should('be.visible')
            .should('not.be.disabled');
          cy.get('select#options[name="root_address_state"]').select('CA');
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

      '686-report-dependent-death/0/additional-information': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('#root_dateMonth').select('Jan');
          cy.get('#root_dateDay').select('1');
          cy.get('#root_dateYear').type('1991');
          cy.get('#root_location_state').select('Alabama');
          cy.get('#root_location_city').type('city');
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
  },

  manifest,
  formConfig,
);

testForm(testConfig);
