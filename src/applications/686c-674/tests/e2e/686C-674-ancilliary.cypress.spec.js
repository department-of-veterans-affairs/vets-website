import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockVaFileNumber from './fixtures/va-file-number.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: [
      'ancilliary-flows',
      'add-child-report-divorce',
      'spouse-report-divorce',
    ],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      cy.login();
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
          cy.get('a.vads-c-action-link--green')
            .first()
            .click();
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
          cy.get('.usa-button-primary').click();
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
          cy.get('.usa-button-primary').click();
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
          cy.get('.usa-button-primary').click();
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
          cy.get('.usa-button-primary').click();
        });
      },

      '686-report-add-child/introduction': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      '686-report-add-child/summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-radio-option[value="N"]').click();

          cy.get('.usa-button-primary').click();
        });
      },

      'add-child/0/additional-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_doesChildLiveWithYouYes').click();
          cy.get('.usa-button-primary').click();
        });
      },
    },
  },

  manifest,
  formConfig,
);

testForm(testConfig);
