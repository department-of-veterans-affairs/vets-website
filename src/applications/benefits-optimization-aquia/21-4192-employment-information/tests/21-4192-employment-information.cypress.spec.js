import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '@bio-aquia/21-4192-employment-information/config/form';
import manifest from '@bio-aquia/21-4192-employment-information/manifest.json';
import {
  clickContinue,
  fillVeteranInformation,
  fillVeteranContactInformation,
  fillTextInput,
  fillMemorableDate,
  fillAddress,
  setCheckbox,
  fillTextarea,
  selectRadioByValue,
  selectRadioAndWait,
} from '@bio-aquia/shared/tests/cypress-helpers';
import mockUser from './fixtures/mocks/user.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir:
      'applications/benefits-optimization-aquia/21-4192-employment-information/tests/fixtures/data',
    dataSets: ['minimal-test', 'maximal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // Wait for the start button to be visible and ready
          cy.findByTestId('start-employment-info-link')
            .should('be.visible')
            .click();
        });
      },
      'veteran-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillVeteranInformation(data);
          });
          clickContinue();
        });
      },
      'veteran-contact-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillVeteranContactInformation(data);
          });
          clickContinue();
        });
      },
      'employer-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const empInfo = data.employerInformation;
            fillTextInput('employerName', empInfo?.employerName);
            fillAddress('employerAddress', empInfo?.employerAddress);
          });
          clickContinue();
        });
      },
      'employment-dates': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const dates = data.employmentDates;
            fillMemorableDate('beginningDate', dates?.beginningDate);
            if (dates?.currentlyEmployed !== undefined) {
              setCheckbox('currentlyEmployed', dates.currentlyEmployed);
            }
            if (!dates?.currentlyEmployed && dates?.endingDate) {
              fillMemorableDate('endingDate', dates.endingDate);
            }
          });
          clickContinue();
        });
      },
      'employment-earnings-hours': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const earnings = data.employmentEarningsHours;
            fillTextarea('typeOfWork', earnings?.typeOfWork);
            fillTextInput('amountEarned', earnings?.amountEarned);
            fillTextInput('timeLost', earnings?.timeLost);
            fillTextInput('dailyHours', earnings?.dailyHours);
            fillTextInput('weeklyHours', earnings?.weeklyHours);
          });
          clickContinue();
        });
      },
      'employment-concessions': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const concessions = data.employmentConcessions;
            if (concessions?.concessions) {
              fillTextarea('concessions', concessions.concessions);
            }
          });
          clickContinue();
        });
      },
      'employment-termination': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const termination = data.employmentTermination;
            fillTextarea('terminationReason', termination?.terminationReason);
            fillMemorableDate('dateLastWorked', termination?.dateLastWorked);
          });
          clickContinue();
        });
      },
      'employment-last-payment': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const payment = data.employmentLastPayment;
            fillMemorableDate('dateOfLastPayment', payment?.dateOfLastPayment);
            fillTextInput(
              'grossAmountLastPayment',
              payment?.grossAmountLastPayment,
            );
            if (payment?.lumpSumPayment) {
              // Use helper that properly triggers React state update
              selectRadioAndWait(payment.lumpSumPayment, 1000);
            }
            if (payment?.lumpSumPayment === 'yes') {
              // Wait for conditional fields to appear in DOM
              cy.get('va-text-input[name="grossAmountPaid"]', {
                timeout: 5000,
              }).should('be.visible');
              fillTextInput('grossAmountPaid', payment.grossAmountPaid);
              fillMemorableDate('datePaid', payment.datePaid);
            }
          });
          clickContinue();
        });
      },
      'duty-status': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { dutyStatus } = data;
            if (dutyStatus?.reserveOrGuardStatus) {
              selectRadioByValue(dutyStatus.reserveOrGuardStatus);
            }
          });
          clickContinue();
        });
      },
      'duty-status-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const details = data.dutyStatusDetails;
            fillTextarea('currentDutyStatus', details?.currentDutyStatus);
            if (details?.disabilitiesPreventDuties) {
              selectRadioByValue(details.disabilitiesPreventDuties);
            }
          });
          clickContinue();
        });
      },
      'benefits-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const benefits = data.benefitsInformation;
            if (benefits?.benefitEntitlement) {
              selectRadioByValue(benefits.benefitEntitlement);
            }
          });
          clickContinue();
        });
      },
      'benefits-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const details = data.benefitsDetails;
            fillTextarea('benefitType', details?.benefitType);
            fillTextInput('grossMonthlyAmount', details?.grossMonthlyAmount);
            fillMemorableDate(
              'startReceivingDate',
              details?.startReceivingDate,
            );
            fillMemorableDate('firstPaymentDate', details?.firstPaymentDate);
            fillMemorableDate('stopReceivingDate', details?.stopReceivingDate);
          });
          clickContinue();
        });
      },
      remarks: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { remarks } = data;
            if (remarks?.remarks) {
              fillTextarea('remarks', remarks.remarks);
            }
          });
          clickContinue();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
      cy.login(mockUser);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

// Add stability between tests
beforeEach(() => {
  // Clear any lingering state between tests
  cy.clearCookies();
  cy.clearLocalStorage();
});

testForm(testConfig);

// Configure retries for the test suite to handle transient network errors
if (Cypress.config('isInteractive')) {
  // No retries in interactive mode
  Cypress.config('retries', 0);
} else {
  // Retry up to 2 times in run mode
  Cypress.config('retries', { runMode: 2, openMode: 0 });
}
