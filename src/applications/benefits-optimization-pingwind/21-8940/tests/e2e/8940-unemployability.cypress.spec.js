import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/feature-toggles.json';
import user from './fixtures/mocks/user.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  fillDateWebComponentPattern,
  fillFullNameWebComponentPattern,
  fillTextWebComponent,
  reviewAndSubmitPageFlow,
  selectRadioWebComponent,
  selectYesNoWebComponent,
  selectCheckboxWebComponent,
} from '../../../shared/tests/e2e/helpers';
import { fillNumberWebComponent } from './helpers/local-helpers';

const formatUsPhoneNumber = contact => {
  if (!contact) {
    return contact;
  }
  const digitsOnly = contact.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    const area = digitsOnly.slice(0, 3);
    const exchange = digitsOnly.slice(3, 6);
    const subscriber = digitsOnly.slice(6);
    return `(${area}) ${exchange}-${subscriber}`;
  }
  return contact;
};

const fillTelephoneField = (fieldName, phone) => {
  if (!phone) {
    return;
  }
  const contact = typeof phone === 'string' ? phone : phone.contact;
  if (!contact) {
    return;
  }
  const alias = `${fieldName}Input`.replace(/[^A-Za-z0-9_-]/g, '');
  cy.get(`va-telephone-input[name="root_${fieldName}"]`)
    .shadow()
    .find('va-text-input')
    .shadow()
    .find('input')
    .as(alias);

  cy.get(`@${alias}`)
    .click({ force: true })
    .clear({ force: true })
    .type(contact, { force: true })
    .should('have.value', formatUsPhoneNumber(contact));
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.clickStartForm();
        });
      },
      'important-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'what-you-need': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'information-we-are-required-to-share': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          selectCheckboxWebComponent(
            'acknowledgeFairInformationPractices',
            true,
          );
          selectCheckboxWebComponent('acknowledgePrivacyActRights', true);
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'confirmation-question': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const confirmationSelection = data.confirmationQuestion ? 'Y' : 'N';
            cy.selectVaRadioOption(
              'confirmation-question',
              confirmationSelection,
            );

            if (
              data.confirmationQuestion === false &&
              typeof data.newConditionQuestion !== 'undefined'
            ) {
              const newConditionSelection = data.newConditionQuestion
                ? 'Y'
                : 'N';
              cy.selectVaRadioOption(
                'new-condition-question',
                newConditionSelection,
              );
            }

            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'section-1-banner': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'personal-information-1': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'veteran_fullName',
              data.veteran.fullName,
            );
            fillDateWebComponentPattern(
              'veteran_dateOfBirth',
              data.veteran.dateOfBirth,
            );
            fillTextWebComponent('veteran_ssn', data.veteran.ssn);
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'contact-information-1': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'veteran_address',
              data.veteran.address,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'contact-information-2': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTelephoneField('veteran_homePhone', data.veteran.homePhone);
            fillTextWebComponent('veteran_email', data.veteran.email);
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'disability-and-medical-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const disabilities = data.sectionTwoP1.disabilityDescription || [];

            disabilities.forEach((entry, index) => {
              if (index > 0) {
                cy.findByText(/add another disability/i, {
                  selector: 'button',
                }).click();
              }

              fillTextWebComponent(
                `disabilityDescription_${index}_disability`,
                entry.disability,
              );
            });
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'doctor-care-question': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { doctorCareQuestion = {} } = data;
            const { hasReceivedDoctorCare, doctorCareType } =
              doctorCareQuestion;
            selectYesNoWebComponent(
              'doctorCareQuestion_hasReceivedDoctorCare',
              hasReceivedDoctorCare,
            );
            if (hasReceivedDoctorCare) {
              selectRadioWebComponent(
                'doctorCareQuestion_doctorCareType',
                doctorCareType,
              );
            }
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'hospital-care-question': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { hospitalizationQuestion = {} } = data;
            const { hasBeenHospitalized, hospitalType } =
              hospitalizationQuestion;
            selectYesNoWebComponent(
              'hospitalizationQuestion_hasBeenHospitalized',
              hasBeenHospitalized,
            );
            if (hasBeenHospitalized) {
              selectRadioWebComponent(
                'hospitalizationQuestion_hospitalType',
                hospitalType,
              );
            }
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employment-statement': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { sectionThree } = data;
            fillDateWebComponentPattern(
              'disabilityDate',
              sectionThree.disabilityDate,
            );
            fillDateWebComponentPattern(
              'lastWorkedDate',
              sectionThree.lastWorkedDate,
            );
            fillDateWebComponentPattern(
              'disabledWorkDate',
              sectionThree.disabledWorkDate,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'peak-earnings': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { peakEarnings } = data;
            fillNumberWebComponent(
              'maxYearlyEarnings',
              peakEarnings?.maxYearlyEarnings,
            );
            fillNumberWebComponent('yearEarned', peakEarnings?.yearEarned);
            fillTextWebComponent('occupation', peakEarnings?.occupation);
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'section-3-employment': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const employers = data.employersHistory || [];

            if (!employers.length) {
              cy.findByText(/continue/i, { selector: 'button' }).click();
              return;
            }

            employers.forEach((entry, index) => {
              if (index > 0) {
                cy.findByRole('button', {
                  name: /add another employer/i,
                }).click();
              }

              fillTextWebComponent(
                `employersHistory_${index}_employerName`,
                entry.employerName,
              );

              cy.fillAddressWebComponentPattern(
                `employersHistory_${index}_employerAddress`,
                entry.employerAddress,
              );

              fillTextWebComponent(
                `employersHistory_${index}_typeOfWork`,
                entry.typeOfWork,
              );

              fillNumberWebComponent(
                `employersHistory_${index}_hoursPerWeek`,
                entry.hoursPerWeek,
              );

              fillDateWebComponentPattern(
                `employersHistory_${index}_startDate`,
                entry.startDate,
              );

              fillDateWebComponentPattern(
                `employersHistory_${index}_endDate`,
                entry.endDate,
              );

              fillNumberWebComponent(
                `employersHistory_${index}_timeLost`,
                entry.timeLost,
              );

              fillNumberWebComponent(
                `employersHistory_${index}_earnings`,
                entry.earnings,
              );
            });

            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employment-application-records-summary': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'hasTriedEmployment',
              data.employmentHistory.hasTriedEmployment,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'current-military-service': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { currentMilitaryService } = data;
            selectYesNoWebComponent(
              'currentlyServing',
              currentMilitaryService?.currentlyServing,
            );
            if (currentMilitaryService?.currentlyServing) {
              selectYesNoWebComponent(
                'activeDutyOrders',
                currentMilitaryService?.activeDutyOrders,
              );
            }
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'current-income': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { currentIncome } = data;
            fillNumberWebComponent('totalIncome', currentIncome?.totalIncome);
            fillNumberWebComponent(
              'monthlyIncome',
              currentIncome?.monthlyIncome,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'leaving-last-position': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { leavingLastPosition } = data;
            selectYesNoWebComponent(
              'leftDueToDisability',
              leavingLastPosition?.leftDueToDisability,
            );
            selectYesNoWebComponent(
              'receivesDisabilityRetirement',
              leavingLastPosition?.receivesDisabilityRetirement,
            );
            selectYesNoWebComponent(
              'receivesWorkersCompensation',
              leavingLastPosition?.receivesWorkersCompensation,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'education-and-training': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const education = data.sectionFour;
            selectRadioWebComponent('educationLevel', education.educationLevel);
            if (education.gradeSchool) {
              selectRadioWebComponent('gradeSchool', education.gradeSchool);
            }
            if (education.highSchool) {
              selectRadioWebComponent('highSchool', education.highSchool);
            }
            if (education.college) {
              selectRadioWebComponent('college', education.college);
            }
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'education-and-training-before-disability': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'otherBeforeEducation',
              data.beforeDisability.otherBeforeEducation,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'education-and-training-after-disability': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'otherAfterEducation',
              data.afterDisability.otherAfterEducation,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'authorization-and-certification': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          selectCheckboxWebComponent('authorizationRelease', true);
          selectCheckboxWebComponent('certificationStatements', true);
          selectCheckboxWebComponent('serviceConnectedStatements', true);
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            reviewAndSubmitPageFlow(
              data.veteran.fullName,
              'Submit veteran application',
            );
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
