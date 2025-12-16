import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockVaFileNumber from './fixtures/va-file-number.json';
import user from './user.json';

import {
  fillDateWebComponentPattern,
  fillStandardTextInput,
  fillTextareaWebComponent,
  fillSelectWebComponent,
  selectRadioWebComponent,
  signAndSubmit,
  selectRadioWebComponentAlt,
} from './cypress.helpers';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
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
              name: 'vaDependentsNetWorthAndPension',
              value: false,
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
          cy.injectAxeThenAxeCheck();
          cy.clickStartForm();
        });
      },

      'current-marriage-information/date-of-marriage': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.currentMarriageInformation?.date) {
              fillDateWebComponentPattern(
                'currentMarriageInformation_date',
                data.currentMarriageInformation.date,
              );
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
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

            // Fill state (if inside USA)
            if (location?.state) {
              cy.get(
                'select[name="root_currentMarriageInformation_location_state"]',
              ).select(location.state);
            }

            // Fill country (if outside USA)
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

      'current-spouse-marriage-history/:index/date-marriage-started': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const marriage = data.spouseMarriageHistory?.[0];
            if (marriage?.startDate) {
              fillDateWebComponentPattern('startDate', marriage.startDate);
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'current-spouse-marriage-history/:index/date-marriage-ended': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const marriage = data.spouseMarriageHistory?.[0];
            if (marriage?.endDate) {
              fillDateWebComponentPattern('endDate', marriage.endDate);
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'report-674/add-students/:index/student-relationship': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const student = data.studentInformation?.[0];

            if (student?.relationshipToStudent) {
              selectRadioWebComponentAlt(
                'relationshipToStudent',
                student.relationshipToStudent,
              );
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'report-674/add-students/:index/student-marriage-date': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const student = data.studentInformation?.[0];
            if (student?.marriageDate) {
              fillDateWebComponentPattern('marriageDate', student.marriageDate);
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'report-674/add-students/:index/student-education-benefits/start-date': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const student = data.studentInformation?.[0];
            if (student?.benefitPaymentDate) {
              fillDateWebComponentPattern(
                'benefitPaymentDate',
                student.benefitPaymentDate,
              );
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'report-674/add-students/:index/term-dates': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const termDates =
              data.studentInformation?.[0]?.schoolInformation?.currentTermDates;
            if (termDates?.officialSchoolStartDate) {
              fillDateWebComponentPattern(
                'schoolInformation_currentTermDates_officialSchoolStartDate',
                termDates.officialSchoolStartDate,
              );
            }
            if (termDates?.expectedStudentStartDate) {
              fillDateWebComponentPattern(
                'schoolInformation_currentTermDates_expectedStudentStartDate',
                termDates.expectedStudentStartDate,
              );
            }
            if (termDates?.expectedGraduationDate) {
              fillDateWebComponentPattern(
                'schoolInformation_currentTermDates_expectedGraduationDate',
                termDates.expectedGraduationDate,
              );
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'report-674/add-students/:index/previous-term-dates': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const lastTerm =
              data.studentInformation?.[0]?.schoolInformation
                ?.lastTermSchoolInformation;

            if (lastTerm?.termBegin) {
              fillDateWebComponentPattern(
                'schoolInformation_lastTermSchoolInformation_termBegin',
                lastTerm.termBegin,
              );
            }

            if (lastTerm?.dateTermEnded) {
              fillDateWebComponentPattern(
                'schoolInformation_lastTermSchoolInformation_dateTermEnded',
                lastTerm.dateTermEnded,
              );
            }

            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'report-674/add-students/:index/additional-remarks': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const student = data.studentInformation?.[0];
            if (student?.remarks) {
              fillTextareaWebComponent('remarks', student.remarks);
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      '686-report-add-child/:index/marriage-end-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const child = data.childrenToAdd?.[0];

            if (child?.marriageEndDate) {
              fillDateWebComponentPattern(
                'marriageEndDate',
                child.marriageEndDate,
              );
            }

            if (child?.marriageEndReason) {
              selectRadioWebComponent(
                'marriageEndReason',
                child.marriageEndReason,
              );
            }

            // Fill if "Other" is selected
            if (
              child?.marriageEndReason === 'Other' &&
              child?.marriageEndDescription
            ) {
              fillStandardTextInput(
                'marriageEndDescription',
                child.marriageEndDescription,
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
