import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import unset from 'platform/utilities/data/unset';

import fullSchema1990 from 'vets-json-schema/dist/22-1990-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import yearUI from 'platform/forms-system/src/js/definitions/year';
import {
  validateBooleanGroup,
  validateCurrentOrFutureDate,
} from 'platform/forms-system/src/js/validation';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import { genderLabels } from 'platform/static-data/labels';
import fullNameUI from 'platform/forms/definitions/fullName';
import PreSubmitInfo from '../pages/PreSubmitInfo';
import contactInformationPage from '../../pages/contactInformation';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import GuardianInformation from '../pages/GuardianInformation';

import manifest from '../manifest.json';

import seniorRotcUI from '../../definitions/seniorRotc';
import createDirectDepositPage1990 from '../pages/DirectDeposit';

import * as toursOfDuty from '../../definitions/toursOfDuty';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { benefitsEligibilityUpdate } from '../pages/benefitsEligibilityUpdate';

import {
  transform,
  benefitsEligibilityBox,
  prefillTransformer,
  SeventeenOrOlder,
  eighteenOrOver,
  ageWarning,
} from '../helpers';

import { urlMigration } from '../../config/migrations';

const {
  chapter33,
  chapter30,
  chapter1606,
  seniorRotcScholarshipProgram,
  seniorRotc,
  additionalContributions,
  activeDutyKicker,
  reserveKicker,
  serviceAcademyGraduationYear,
} = fullSchema1990.properties;

const {
  date,
  fullName,
  ssn,
  gender,
  dateRange,
  year,
  currentlyActiveDuty,
  address,
  usaPhone,
} = fullSchema1990.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1990`,
  trackingPrefix: 'edu-',
  formId: VA_FORM_IDS.FORM_22_1990,
  saveInProgress: {
    messages: {
      inProgress:
        'Your education benefits application (22-1990) is in progress.',
      expired:
        'Your saved education benefits application (22-1990) has expired. If you want to apply for education benefits, please start a new application.',
      saved: 'Your education benefits application has been saved.',
    },
  },
  version: 1,
  migrations: [urlMigration('/1990')],
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  prefillEnabled: true,
  prefillTransformer,
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date,
    dateRange,
    fullName,
    gender,
    ssn,
    year,
    address,
    usaPhone,
  },
  title: 'Apply for education benefits',
  subTitle: 'Form 22-1990',
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation: {
          path: 'applicant/information',
          title: 'Applicant information',
          initialData: {},

          uiSchema: {
            'ui:description': applicantDescription,
            veteranFullName: fullNameUI,

            veteranSocialSecurityNumber: {
              ...ssnUI,
              'ui:title': 'Social Security number',
            },

            veteranDateOfBirth: {
              ...currentOrPastDateUI('Your date of birth'),
              'ui:errorMessages': {
                pattern: 'Please provide a valid date',
                required: 'Please enter a date',
                futureDate: 'Please provide a valid date',
              },
              'ui:validations': [
                (errors, dob) => {
                  // If we have a complete date, check to make sure it’s a valid dob
                  if (/\d{4}-\d{2}-\d{2}/.test(dob) && !SeventeenOrOlder(dob)) {
                    errors.addError('You must be at least 17 to apply');
                  }
                },
              ],
            },

            minorHighSchoolQuestions: {
              'ui:description': ageWarning,
              'ui:options': {
                expandUnder: 'veteranDateOfBirth',
                hideIf: formData => {
                  let hideCondition;
                  const dob = get('veteranDateOfBirth', formData);
                  if (!eighteenOrOver(dob) && SeventeenOrOlder(dob)) {
                    hideCondition = false;
                  } else {
                    hideCondition = true;
                  }
                  return hideCondition;
                },
              },
              minorHighSchoolQuestion: {
                'ui:title':
                  'Applicant has graduated high school or received GED?',
                'ui:widget': 'yesNo',
                'ui:required': formData =>
                  !eighteenOrOver(formData.veteranDateOfBirth),
              },
              highSchoolGedGradDate: {
                ...currentOrPastDateUI('Date graduated'),
                'ui:options': {
                  expandUnder: 'minorHighSchoolQuestion',
                },
                'ui:required': formData => {
                  let isRequired = false;
                  if (!eighteenOrOver(formData.veteranDateOfBirth)) {
                    const yesNoResults =
                      formData.minorHighSchoolQuestions.minorHighSchoolQuestion;
                    if (yesNoResults) {
                      isRequired = true;
                    }
                    if (!yesNoResults) {
                      isRequired = false;
                    }
                  }
                  return isRequired;
                },
              },
              highSchoolGedExpectedGradDate: {
                'ui:title': 'Date expected to graduate',
                'ui:widget': 'date',
                'ui:options': {
                  expandUnder: 'minorHighSchoolQuestion',
                  expandUnderCondition: false,
                },
                'ui:validations': [validateCurrentOrFutureDate],
                'ui:errorMessages': {
                  pattern: 'Please enter a valid current or future date',
                  required: 'Please enter a date',
                },
              },
            },

            gender: {
              'ui:widget': 'radio',
              'ui:title': 'Gender',
              'ui:options': {
                labels: genderLabels,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName: {
                type: 'object',
                required: ['first', 'last'],
                properties: fullName.properties,
              },

              veteranSocialSecurityNumber: {
                $ref: '#/definitions/ssn',
              },

              veteranDateOfBirth: {
                $ref: '#/definitions/date',
              },

              minorHighSchoolQuestions: {
                type: 'object',
                properties: {
                  minorHighSchoolQuestion: {
                    type: 'boolean',
                  },
                  highSchoolGedGradDate: {
                    type: 'object',
                    $ref: '#/definitions/date',
                  },
                  highSchoolGedExpectedGradDate: {
                    type: 'object',
                    $ref: '#/definitions/date',
                  },
                },
              },

              gender: {
                $ref: '#/definitions/gender',
              },
            },
            required: ['veteranSocialSecurityNumber', 'veteranDateOfBirth'],
          },
        },
      },
    },
    benefitsEligibility: {
      title: 'Benefits eligibility',
      pages: {
        benefitsEligibility: {
          title: 'Benefits eligibility',
          path: 'benefits-eligibility/benefits-selection',
          uiSchema: benefitsEligibilityUpdate(
            benefitsEligibilityBox,
            validateBooleanGroup,
          ).uiSchema,
          schema: benefitsEligibilityUpdate(
            '',
            null,
            chapter33,
            chapter30,
            chapter1606,
          ).schema,
        },
      },
    },
    militaryHistory: {
      title: 'Service history',
      pages: {
        servicePeriods: {
          title: 'Service periods',
          path: 'military-history/service-periods',
          uiSchema: {
            // 'ui:title': 'Service periods',
            toursOfDuty: merge({}, toursOfDuty.uiSchema, {
              'ui:title': null,
              'ui:description': 'Please record all your periods of service.',
              'ui:options': {
                keepInPageOnReview: true,
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              toursOfDuty: toursOfDuty.schema(fullSchema1990, {
                required: ['serviceBranch', 'dateRange.from'],
                fields: [
                  'serviceBranch',
                  'serviceStatus',
                  'dateRange',
                  'applyPeriodToSelected',
                  'benefitsToApplyTo',
                  'view:disclaimer',
                ],
              }),
            },
          },
        },
        militaryService: {
          title: 'Military service',
          path: 'military-history/military-service',
          uiSchema: {
            serviceAcademyGraduationYear: {
              ...yearUI,
              'ui:title':
                'If you received a commission from a military service academy, what year did you graduate?',
            },
            currentlyActiveDuty: {
              yes: {
                'ui:title': 'Are you on active duty now?',
                'ui:widget': 'yesNo',
              },
              onTerminalLeave: {
                'ui:title': 'Are you on terminal leave now?',
                'ui:widget': 'yesNo',
                'ui:options': {
                  expandUnder: 'yes',
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              serviceAcademyGraduationYear,
              currentlyActiveDuty: {
                type: 'object',
                properties: {
                  yes: currentlyActiveDuty.properties.yes,
                  onTerminalLeave:
                    currentlyActiveDuty.properties.onTerminalLeave,
                },
              },
            },
          },
        },
        rotcHistory: {
          title: 'ROTC history',
          path: 'military-history/rotc-history',
          uiSchema: {
            'ui:title': 'ROTC history',
            seniorRotcScholarshipProgram: {
              'ui:title':
                'Are you in a senior ROTC scholarship program right now that pays your tuition, fees, books, and supplies? (Covered under Section 2107 of Title 10, U.S. Code)',
              'ui:widget': 'yesNo',
            },
            'view:seniorRotc': {
              'ui:title': 'Were you commissioned as a result of senior ROTC?',
              'ui:widget': 'yesNo',
            },
            seniorRotc: {
              commissionYear: merge({}, yearUI, {
                'ui:title': 'Year of commission:',
              }),
              rotcScholarshipAmounts: seniorRotcUI,
              'ui:options': {
                expandUnder: 'view:seniorRotc',
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              seniorRotcScholarshipProgram,
              'view:seniorRotc': {
                type: 'boolean',
              },
              seniorRotc: unset('required', seniorRotc),
            },
          },
        },
        contributions: {
          title: 'Contributions',
          path: 'military-history/contributions',
          uiSchema: {
            'ui:title': 'Contributions',
            'ui:description': 'Select all that apply:',
            additionalContributions: {
              'ui:title':
                'I made contributions (up to $600) to increase the amount of my monthly benefits.',
            },
            activeDutyKicker: {
              'ui:title':
                'I qualify for an Active Duty Kicker (sometimes called a college fund).',
            },
            reserveKicker: {
              'ui:title':
                'I qualify for a Reserve Kicker (sometimes called a college fund).',
            },
            'view:activeDutyRepayingPeriod': {
              'ui:title':
                'I have a period of service that the Department of Defense counts toward an education loan payment.',
              'ui:options': {
                expandUnderClassNames: 'schemaform-expandUnder-indent',
              },
            },
            activeDutyRepayingPeriod: merge(
              {},
              {
                'ui:options': {
                  expandUnder: 'view:activeDutyRepayingPeriod',
                },
                to: {
                  'ui:required': formData =>
                    formData['view:activeDutyRepayingPeriod'],
                },
                from: {
                  'ui:required': formData =>
                    formData['view:activeDutyRepayingPeriod'],
                },
              },
              dateRangeUI('Start date', 'End date'),
            ),
          },
          schema: {
            type: 'object',
            properties: {
              additionalContributions,
              activeDutyKicker,
              reserveKicker,
              'view:activeDutyRepayingPeriod': {
                type: 'boolean',
              },
              activeDutyRepayingPeriod: dateRange,
            },
          },
        },
      },
    },
    personalInformation: {
      title: 'Personal information',
      pages: {
        contactInformation: merge({}, contactInformationPage(fullSchema1990), {
          uiSchema: {
            'ui:title': 'Contact information',
          },
        }),
        directDeposit: createDirectDepositPage1990(),
      },
    },
    GuardianInformation: {
      title: 'Guardian information',
      pages: {
        guardianInformation: GuardianInformation(fullSchema1990, {}),
      },
    },
  },
};

export default formConfig;
