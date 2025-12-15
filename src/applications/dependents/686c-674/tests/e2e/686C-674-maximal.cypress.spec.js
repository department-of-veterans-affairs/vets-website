import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  fillDateWebComponentPattern,
  fillStandardTextInput,
  fillTextareaWebComponent,
  fillSelectWebComponent,
  selectRadioWebComponent,
  signAndSubmit,
  selectRadioWebComponentAlt,
  setupCypress,
} from './cypress.helpers';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['maximal'],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      // Pass form start page path
      setupCypress('/add-remove-form-21-686c-674/veteran-information');
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.wait('@mockVaFileNumber');
          cy.injectAxeThenAxeCheck();
          cy.get('va-button[data-testid="continue-your-application"]').click();
        });
      },

      'check-veteran-pension': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data?.veteranInformation?.isInReceiptOfPension === -1) {
              selectRadioWebComponentAlt('view:checkVeteranPension', 'Y');
            }
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'current-spouse-marriage-history/:index/location-where-marriage-started': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.currentMarriageInformation?.outsideUsa) {
              cy.get('va-checkbox[name="root_startLocation_outsideUsa"]')
                .shadow()
                .find('input[type="checkbox"]')
                .check({ force: true });
            }

            const location = data.currentMarriageInformation?.location;

            if (location?.city) {
              fillStandardTextInput(
                'startLocation_location_city',
                location.city,
              );
            }

            if (location?.state) {
              fillSelectWebComponent(
                'startLocation_location_state',
                location.state,
              );
            }

            if (location?.country) {
              cy.get(
                'va-select[name="root_startLocation_location_country"]',
              ).should('be.visible');
              fillSelectWebComponent(
                'startLocation_location_country',
                location.country,
              );
            }

            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
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

      'current-marriage-information/spouse-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const address = data.doesLiveWithSpouse?.address;

            if (address?.country) {
              fillSelectWebComponent(
                'doesLiveWithSpouse_address_country',
                address.country,
              );
            }
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
              fillSelectWebComponent(
                'doesLiveWithSpouse_address_state',
                address.state,
              );
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

      'report-674/add-students/:index/date-student-stopped-attending': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const date =
              data.studentInformation?.[0]?.schoolInformation
                ?.dateFullTimeEnded;

            if (date) {
              fillDateWebComponentPattern(
                'schoolInformation_dateFullTimeEnded',
                date,
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

      '686-stepchild-no-longer-part-of-household/:index/date-child-left-household': ({
        afterHook,
      }) => {
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
