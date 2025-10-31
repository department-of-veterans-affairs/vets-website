import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
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
} from '../../../shared/tests/e2e/helpers';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/start/i, { selector: 'button' }).click({ force: true });
        });
      },
      'confirmation-required': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'confirmationQuestion',
              data.confirmationQuestion,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
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
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'personal-information-2': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
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
            fillTextWebComponent('veteran_homePhone', data.veteran.homePhone);
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
              cy.findByText(/add another disability/i, {
                selector: 'button',
              }).click();

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
            selectYesNoWebComponent(
              'doctorCareQuestion_hasReceivedDoctorCare',
              data.doctorCareQuestion.hasReceivedDoctorCare,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'hospital-care-question': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'hospitalizationQuestion_hasBeenHospitalized',
              data.hospitalizationQuestion.hasBeenHospitalized,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employment-statement': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const sectionThree = data.sectionThree;
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
            fillTextWebComponent(
              'maxYearlyEarnings',
              sectionThree.maxYearlyEarnings,
            );
            fillTextWebComponent('yearEarned', sectionThree.yearEarned);
            fillTextWebComponent('occupation', sectionThree.occupation);
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employment-application-records-summary': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'employmentHistory_hasTriedEmployment',
              data.employmentHistory.hasTriedEmployment,
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
            selectRadioWebComponent(
              'educationLevel',
              education.educationLevel,
            );
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
              'otherEducation',
              data.beforeDisability.otherEducation,
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
              'otherEducation',
              data.afterDisability.otherEducation,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'authorization-and-certification': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const sectionSix = data.sectionSix;
            fillTextWebComponent(
              'signatureOfClaimant',
              sectionSix.signatureOfClaimant,
            );
            fillDateWebComponentPattern('dateSigned', sectionSix.dateSigned);
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            reviewAndSubmitPageFlow(
              data.veteran.fullName,
              'Submit application',
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
