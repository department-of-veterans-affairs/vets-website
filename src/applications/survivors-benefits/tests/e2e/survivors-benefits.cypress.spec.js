import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockUser from '../fixtures/mocks/user.json';
import mockSubmit from './fixtures/mocks/mock-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^Apply for survivors benefits/i, {
            selector: 'a[href="#start"]',
          })
            .last()
            .click({ force: true });
        });
      },
      veteran: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.veteranFullName) {
              cy.fillVaTextInput(
                'root_veteranFullName_first',
                data.veteranFullName.first,
              );
              cy.fillVaTextInput(
                'root_veteranFullName_last',
                data.veteranFullName.last,
              );
            }
            if (data.veteranDateOfBirth) {
              cy.fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth);
            }
            cy.clickFormContinue();
          });
        });
      },
      'veteran-additional-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.vaClaimsHistory !== undefined) {
              cy.selectYesNoVaRadioOption(
                'root_vaClaimsHistory',
                data.vaClaimsHistory,
              );
            }
            if (data.diedOnDuty !== undefined) {
              cy.selectYesNoVaRadioOption('root_diedOnDuty', data.diedOnDuty);
            }
            if (data.veteranDateOfDeath) {
              cy.fillDate('root_veteranDateOfDeath', data.veteranDateOfDeath);
            }
            cy.clickFormContinue();
          });
        });
      },
      'claimant-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.claimantFullName) {
              cy.fillVaTextInput(
                'root_claimantFullName_first',
                data.claimantFullName.first,
              );
              cy.fillVaTextInput(
                'root_claimantFullName_last',
                data.claimantFullName.last,
              );
            }
            if (data.claimantDateOfBirth) {
              cy.fillDate('root_claimantDateOfBirth', data.claimantDateOfBirth);
            }
            cy.clickFormContinue();
          });
        });
      },
      'service-period': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.branchOfService !== undefined) {
              cy.selectVaCheckbox(
                'root_branchOfService_MARINE_CORPS',
                data.branchOfService.MARINE_CORPS,
              );
            }
            if (data.dateInitiallyEnteredActiveDuty) {
              cy.fillDate(
                'root_dateInitiallyEnteredActiveDuty',
                data.dateInitiallyEnteredActiveDuty,
              );
            }
            if (data.finalReleaseDateFromActiveDuty) {
              cy.fillDate(
                'root_finalReleaseDateFromActiveDuty',
                data.finalReleaseDateFromActiveDuty,
              );
            }
            if (data.cityStateOrForeignCountry) {
              cy.fillVaTextInput(
                'root_cityStateOrForeignCountry',
                data.cityStateOrForeignCountry,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'national-guard-service-period': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.dateOfActivation) {
              cy.fillDate('root_dateOfActivation', data.dateOfActivation);
            }
            if (data.unitName) {
              cy.fillVaTextInput('root_unitName', data.unitName);
            }
            if (data.unitPhoneNumber) {
              cy.fillVaTelephoneInput(
                'root_unitPhoneNumber',
                data.unitPhoneNumber,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'prisoner-of-war-period': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.powPeriod) {
              cy.fillDate('root_powPeriod_from', data.powPeriod.from);
              cy.fillDate('root_powPeriod_to', data.powPeriod.to);
            }
            cy.clickFormContinue();
          });
        });
      },
      'household/marriage-to-veteran-location': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.marriageToVeteranStartDate) {
              cy.fillDate(
                'root_marriageToVeteranStartDate',
                data.marriageToVeteranStartDate,
              );
            }
            if (data.marriageToVeteranStartOutsideUS !== undefined) {
              cy.selectVaCheckbox(
                'root_marriageToVeteranStartOutsideUS',
                data.marriageToVeteranStartOutsideUS,
              );
            }
            if (data.marriageToVeteranStartLocation) {
              cy.fillAddressWebComponentPattern(
                'marriageToVeteranStartLocation',
                data.marriageToVeteranStartLocation,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'household/marriage-to-veteran-end-info': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.marriageToVeteranEndDate) {
              cy.fillDate(
                'root_marriageToVeteranEndDate',
                data.marriageToVeteranEndDate,
              );
            }
            if (data.marriageToVeteranEndOutsideUS !== undefined) {
              cy.selectVaCheckbox(
                'root_marriageToVeteranEndOutsideUS',
                data.marriageToVeteranEndOutsideUS,
              );
            }
            if (data.marriageToVeteranEndLocation) {
              cy.fillAddressWebComponentPattern(
                'marriageToVeteranEndLocation',
                data.marriageToVeteranEndLocation,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'household/separation-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.separationExplanation) {
              cy.fillVaTextInput(
                'root_separationExplanation',
                data.separationExplanation,
              );
            }
            if (data.separationStartDate) {
              cy.fillDate('root_separationStartDate', data.separationStartDate);
            }
            if (data.separationEndDate) {
              cy.fillDate('root_separationEndDate', data.separationEndDate);
            }
            if (data.courtOrderedSeparation !== undefined) {
              cy.selectYesNoVaRadioOption(
                'root_courtOrderedSeparation',
                data.courtOrderedSeparation,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'household/remarriage-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.remarriageEndReason !== undefined) {
              cy.selectVaRadioOption(
                'root_remarriageEndReason',
                data.remarriageEndReason,
              );
            }
            if (data.remarriageEndOtherReason) {
              cy.fillVaTextInput(
                'root_remarriageEndOtherReason',
                data.remarriageEndOtherReason,
              );
            }
            if (data.remarriageDate) {
              cy.fillDate('root_remarriageDate', data.remarriageDate);
            }
            if (data.remarriageEndDate) {
              cy.fillDate('root_remarriageEndDate', data.remarriageEndDate);
            }

            cy.clickFormContinue();
          });
        });
      },
      'household/previous-marriage/:index/date-and-location': ({
        afterHook,
        index,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data?.spouseMarriages[index]?.marriageToVeteranDate) {
              cy.fillDate(
                'root_marriageToVeteranDate',
                data.spouseMarriages[index].marriageToVeteranDate,
              );
            }
            if (data?.spouseMarriages[index]?.marriedOutsideUS !== undefined) {
              cy.selectVaCheckbox(
                'root_marriedOutsideUS',
                data.spouseMarriages[index].marriedOutsideUS,
              );
            }
            if (data?.spouseMarriages[index]?.marriageLocation) {
              cy.fillAddressWebComponentPattern(
                'marriageLocation',
                data.spouseMarriages[index].marriageLocation,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'household/previous-marriage/:index/end-date-and-location': ({
        afterHook,
        index,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data?.spouseMarriages[index]?.marriageEndDate) {
              cy.fillDate(
                'root_marriageEndDate',
                data.spouseMarriages[index].marriageEndDate,
              );
            }
            if (
              data?.spouseMarriages[index]?.marriageEndedOutsideUS !== undefined
            ) {
              cy.selectVaCheckbox(
                'root_marriageEndedOutsideUS',
                data.spouseMarriages[index].marriageEndedOutsideUS,
              );
            }
            if (data?.spouseMarriages[index]?.marriageEndLocation) {
              cy.fillAddressWebComponentPattern(
                'marriageEndLocation',
                data.spouseMarriages[index].marriageEndLocation,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'household/veteran-previous-marriages/:index/marriage-date-place': ({
        afterHook,
        index,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data?.veteranMarriages[index]?.marriageDate) {
              cy.fillDate(
                'root_marriageDate',
                data.veteranMarriages[index].marriageDate,
              );
            }
            if (data?.veteranMarriages[index]?.marriedOutsideUS !== undefined) {
              cy.selectVaCheckbox(
                'root_marriedOutsideUS',
                data.veteranMarriages[index].marriedOutsideUS,
              );
            }
            if (data?.veteranMarriages[index]?.marriageLocation) {
              cy.fillAddressWebComponentPattern(
                'marriageLocation',
                data.veteranMarriages[index].marriageLocation,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'household/veteran-previous-marriages/:index/marriage-end-date-location': ({
        afterHook,
        index,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data?.veteranMarriages[index]?.dateOfTermination) {
              cy.fillDate(
                'root_dateOfTermination',
                data.veteranMarriages[index].dateOfTermination,
              );
            }
            if (
              data?.veteranMarriages[index]?.marriageEndedOutsideUS !==
              undefined
            ) {
              cy.selectVaCheckbox(
                'root_marriageEndedOutsideUS',
                data.veteranMarriages[index].marriageEndedOutsideUS,
              );
            }
            if (data?.veteranMarriages[index]?.marriageEndLocation) {
              cy.fillAddressWebComponentPattern(
                'marriageEndLocation',
                data.veteranMarriages[index].marriageEndLocation,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'household/dependents/:index/date-and-place-of-birth': ({
        afterHook,
        index,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data?.dependents[index]?.dateOfBirth) {
              cy.fillDate(
                'root_dateOfBirth',
                data.dependents[index].dateOfBirth,
              );
            }
            if (data?.dependents[index]?.bornOutsideUS !== undefined) {
              cy.selectVaCheckbox(
                'root_bornOutsideUS',
                data.dependents[index].bornOutsideUS,
              );
            }
            if (data?.dependents[index]?.birthPlace) {
              cy.fillAddressWebComponentPattern(
                'birthPlace',
                data.dependents[index].birthPlace,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'claim-information/dic/:index/dates': ({ afterHook, index }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data?.vaMedicalCenters[index]?.startDate) {
              cy.fillDate(
                'root_startDate',
                data.vaMedicalCenters[index].startDate,
              );
            }
            if (data?.vaMedicalCenters[index]?.endDate) {
              cy.fillDate('root_endDate', data.vaMedicalCenters[index].endDate);
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
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(mockUser);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
