import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import user from './fixtures/mocks/user.json';
import mockSubmit from './fixtures/mocks/mock-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    // arrayPages: [{ arrayPath: 'careExpenses', regex: /.*expenses\/care.*/g }],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByRole('link', {
            name: /Report your medical expenses/i,
          }).click({ force: true });
        });
      },
      'applicant/veteran-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.veteranSocialSecurityNumber) {
              cy.fillVaTextInput(
                'root_veteranSocialSecurityNumber_ssn',
                data.veteranSocialSecurityNumber.ssn,
              );
            }
            if (data.veteranDateOfBirth) {
              cy.fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth);
            }
            cy.clickFormContinue();
          });
        });
      },
      'expenses/care/:index/dates': ({ afterHook, index }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.careExpenses?.[index]?.provider) {
              cy.fillVaTextInput(
                'root_provider',
                data.careExpenses[index].provider,
              );
            }
            if (data.careExpenses?.[index]?.careDate?.from) {
              cy.fillDate(
                'root_careDate_from',
                data.careExpenses[index].careDate.from,
              );
            }
            if (data.careExpenses?.[index]?.careDate?.to) {
              cy.fillDate(
                'root_careDate_to',
                data.careExpenses[index].careDate.to,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'expenses/medical/:index/frequency': ({ afterHook, index }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.medicalExpenses?.[index]?.paymentDate) {
              cy.fillDate(
                'root_paymentDate',
                data.medicalExpenses[index].paymentDate,
              );
            }
            if (data.medicalExpenses?.[index]?.paymentFrequency) {
              cy.selectVaRadioOption(
                'root_paymentFrequency',
                data.medicalExpenses[index].paymentFrequency,
              );
            }
            if (data.medicalExpenses?.[index]?.paymentAmount) {
              cy.fillVaTextInput(
                'root_paymentAmount',
                data.medicalExpenses[index].paymentAmount,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'expenses/mileage/:index/destination': ({ afterHook, index }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.mileageExpenses?.[index]?.travelLocation) {
              cy.selectVaRadioOption(
                'root_travelLocation',
                data.mileageExpenses[index].travelLocation,
              );
              if (data.mileageExpenses[index].travelLocation === 'OTHER') {
                cy.fillVaTextInput(
                  'root_otherTravelLocation',
                  data.mileageExpenses[index].otherTravelLocation,
                );
              }
            }
            if (data.mileageExpenses?.[index]?.travelMilesTraveled) {
              cy.fillVaTextInput(
                'root_travelMilesTraveled',
                data.mileageExpenses[index].travelMilesTraveled,
              );
            }
            if (data.mileageExpenses?.[index]?.travelDate) {
              cy.fillDate(
                'root_travelDate',
                data.mileageExpenses[index].travelDate,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { claimantFullName } = data;
            cy.get('va-statement-of-truth')
              .shadow()
              .get('#veteran-signature')
              .shadow()
              .get('input[name="veteran-signature"')
              .type(
                `${claimantFullName.first} ${claimantFullName.middle || ''} ${
                  claimantFullName.last
                }`.trim(),
              );
            cy.get('va-statement-of-truth')
              .shadow()
              .find('input[type="checkbox"]')
              .check({ force: true });
            cy.axeCheck();
            cy.findByText(/submit/i, { selector: 'button' }).click();
          });
        });
      },
    },
    setup: () => {
      cy.log('Logging something before starting tests.');
    },
    setupPerTest: () => {
      // Start an auth'd session here if your form requires it.
      cy.login(user);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
