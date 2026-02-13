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
    dataSets: ['minimal-test', 'child-in-school', 'surviving-spouse'],
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
                'root_veteranFullName_middle',
                data.veteranFullName.middle,
              );
              cy.fillVaTextInput(
                'root_veteranFullName_last',
                data.veteranFullName.last,
              );
              cy.selectVaSelect(
                'root_veteranFullName_suffix',
                data.veteranFullName.suffix,
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
                'root_claimantFullName_middle',
                data.claimantFullName.middle,
              );
              cy.fillVaTextInput(
                'root_claimantFullName_last',
                data.claimantFullName.last,
              );
              cy.selectVaSelect(
                'root_claimantFullName_suffix',
                data.claimantFullName.suffix,
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
            if (data.serviceBranch !== undefined) {
              cy.selectVaSelect('root_serviceBranch', data.serviceBranch);
            }
            if (data?.activeServiceDateRange?.from) {
              cy.fillDate(
                'root_activeServiceDateRange_from',
                data.activeServiceDateRange.from,
              );
            }
            if (data?.activeServiceDateRange?.to) {
              cy.fillDate(
                'root_activeServiceDateRange_to',
                data.activeServiceDateRange.to,
              );
            }
            if (data.placeOfSeparation) {
              cy.fillVaTextInput(
                'root_placeOfSeparation',
                data.placeOfSeparation,
              );
            }
            cy.clickFormContinue();
          });
        });
      },
      'national-guard-service-period': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.nationalGuardActivationDate) {
              cy.fillDate(
                'root_nationalGuardActivationDate',
                data.nationalGuardActivationDate,
              );
            }
            if (data.unitName) {
              cy.fillVaTextInput('root_unitName', data.unitName);
            }
            if (data.unitPhone) {
              cy.fillVaTextInput('root_unitPhone', data.unitPhone);
            }
            cy.clickFormContinue();
          });
        });
      },
      'prisoner-of-war-period': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.powDateRange) {
              cy.fillDate('root_powDateRange_from', data.powDateRange.from);
              cy.fillDate('root_powDateRange_to', data.powDateRange.to);
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
            if (data.marriageToVeteranStartOutsideUs !== undefined) {
              cy.selectVaCheckbox(
                'root_marriageToVeteranStartOutsideUS',
                data.marriageToVeteranStartOutsideUs,
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
            if (data.marriageToVeteranEndOutsideUs !== undefined) {
              cy.selectVaCheckbox(
                'root_marriageToVeteranEndOutsideUS',
                data.marriageToVeteranEndOutsideUs,
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
            if (data.remarriageEndCause !== undefined) {
              cy.selectVaRadioOption(
                'root_remarriageEndCause',
                data.remarriageEndCause,
              );
            }
            if (data.endCauseExplanation) {
              cy.fillVaTextInput(
                'root_endCauseExplanation',
                data.endCauseExplanation,
              );
            }
            if (data.remarriageDates?.from) {
              cy.fillDate(
                'root_remarriageDates_from',
                data.remarriageDates.from,
              );
            }
            if (data.remarriageDates?.to) {
              cy.fillDate('root_remarriageDates_to', data.remarriageDates.to);
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
            if (data?.spouseMarriages[index]?.marriedOutsideUs !== undefined) {
              cy.selectVaCheckbox(
                'root_marriedOutsideUS',
                data.spouseMarriages[index].marriedOutsideUs,
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
            if (data?.veteranMarriages[index]?.marriedOutsideUs !== undefined) {
              cy.selectVaCheckbox(
                'root_marriedOutsideUS',
                data.veteranMarriages[index].marriedOutsideUs,
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
            if (data?.veteransChildren[index]?.childDateOfBirth) {
              cy.fillDate(
                'root_childDateOfBirth',
                data.veteransChildren[index].childDateOfBirth,
              );
            }
            if (data?.veteransChildren[index]?.bornOutsideUs !== undefined) {
              cy.selectVaCheckbox(
                'root_bornOutsideUS',
                data.veteransChildren[index].bornOutsideUs,
              );
            }
            if (data?.veteransChildren[index]?.birthPlace) {
              cy.fillAddressWebComponentPattern(
                'birthPlace',
                data.veteransChildren[index].birthPlace,
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
