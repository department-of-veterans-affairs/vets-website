import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockVaFileNumber from './fixtures/va-file-number.json';
import user from './user.json';
import {
  fillDateWebComponentPattern,
  fillSelectWebComponent,
  fillStandardTextInput,
  signAndSubmit,
} from './cypress.helpers';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
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
          cy.injectAxeThenAxeCheck();
          cy.clickStartForm();
        });
      },

      'current-marriage-information/location-of-marriage': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.currentMarriageInformation?.outsideUsa) {
              cy.get(
                'va-checkbox[name="root_currentMarriageInformation_outsideUsa"]',
              )
                .shadow()
                .find('input[type="checkbox"]')
                .check({ force: true });
            }

            const location = data.currentMarriageInformation?.location;

            if (location?.city) {
              fillStandardTextInput(
                'currentMarriageInformation_location_city',
                location.city,
              );
            }

            if (location?.state) {
              cy.get(
                'select[name="root_currentMarriageInformation_location_state"]',
              ).select(location.state);
            }

            if (location?.country) {
              cy.get(
                'va-select[name="root_currentMarriageInformation_location_country"]',
              ).should('be.visible');
              fillSelectWebComponent(
                'currentMarriageInformation_location_country',
                location.country,
              );
            }

            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'current-marriage-information/spouse-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const address = data.doesLiveWithSpouse?.address;

            if (address?.street) {
              fillStandardTextInput(
                'doesLiveWithSpouse_address_street',
                address.street,
              );
            }
            if (address?.city) {
              fillStandardTextInput(
                'doesLiveWithSpouse_address_city',
                address.city,
              );
            }
            if (address?.state) {
              cy.get(
                'select#options[name="root_doesLiveWithSpouse_address_state"]',
              ).select(address.state);
            }
            if (address?.postalCode) {
              fillStandardTextInput(
                'doesLiveWithSpouse_address_postalCode',
                address.postalCode,
              );
            }

            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'veteran-marriage-history/:index/date-marriage-started': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const marriage = data.veteranMarriageHistory?.[0];
            if (marriage?.startDate) {
              fillDateWebComponentPattern('startDate', marriage.startDate);
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'veteran-marriage-history/:index/date-marriage-ended': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const marriage = data.veteranMarriageHistory?.[0];
            if (marriage?.endDate) {
              fillDateWebComponentPattern('endDate', marriage.endDate);
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      '686-report-marriage-of-child/:index/date-child-married': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const child = data.childMarriage?.[0];
            if (child?.dateMarried) {
              fillDateWebComponentPattern('dateMarried', child.dateMarried);
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'report-child-stopped-attending-school/:index/date-child-left-school': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const child = data.childStoppedAttendingSchool?.[0];
            if (child?.dateChildLeftSchool) {
              fillDateWebComponentPattern(
                'dateChildLeftSchool',
                child.dateChildLeftSchool,
              );
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      '686-stepchild-no-longer-part-of-household/:index/child-address': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const stepchild = data.stepChildren?.[0];
            const address = stepchild?.address;

            if (address?.country) {
              fillSelectWebComponent('address_country', address.country);
            }
            if (address?.street) {
              fillStandardTextInput('address_street', address.street);
            }
            if (address?.city) {
              fillStandardTextInput('address_city', address.city);
            }
            if (address?.state) {
              cy.get('select#options[name="root_address_state"]').select(
                address.state,
              );
            }
            if (address?.postalCode) {
              fillStandardTextInput('address_postalCode', address.postalCode);
            }

            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      '686-report-dependent-death/:index/date-of-death': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const death = data.deaths?.[0];
            if (death?.dependentDeathDate) {
              fillDateWebComponentPattern(
                'dependentDeathDate',
                death.dependentDeathDate,
              );
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      '686-stepchild-no-longer-part-of-household/:index/date-child-left-household':
        ({ afterHook }) => {
          afterHook(() => {
            cy.get('@testData').then(data => {
              const stepchild = data.stepChildren?.[0];
              if (stepchild.dateStepchildLeftHousehold) {
                fillDateWebComponentPattern(
                  'dateStepchildLeftHousehold',
                  stepchild.dateStepchildLeftHousehold,
                );
              }
              cy.injectAxeThenAxeCheck();
              cy.clickFormContinue();
            });
          });
        },

      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          signAndSubmit();
        });
      },
    },
    // skip: Cypress.env('CI'),
  },

  manifest,
  formConfig,
);

testForm(testConfig);
