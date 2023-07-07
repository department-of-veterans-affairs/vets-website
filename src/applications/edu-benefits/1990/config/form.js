import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import unset from 'platform/utilities/data/unset';
import moment from 'moment';

import fullSchema1990 from 'vets-json-schema/dist/22-1990-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import yearUI from 'platform/forms-system/src/js/definitions/year';
import {
  validateBooleanGroup,
  validateCurrentOrFutureDate,
} from 'platform/forms-system/src/js/validation';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import { genderLabels } from 'platform/static-data/labels';
import fullNameUI from 'platform/forms/definitions/fullName';
import PreSubmitInfo from '../pages/PreSubmitInfo';
import contactInformationPage from '../../pages/contactInformation';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import createSchoolSelectionPage from '../../pages/schoolSelection';
import GuardianInformation from '../pages/GuardianInformation';

import manifest from '../manifest.json';

import seniorRotcUI from '../../definitions/seniorRotc';
import employmentHistoryPage from '../../pages/employmentHistory';
import createDirectDepositPage1990 from '../pages/DirectDeposit';

import postHighSchoolTrainingsUI from '../../definitions/postHighSchoolTrainings';
import * as toursOfDuty from '../../definitions/toursOfDuty';
import serviceBefore1977UI from '../../definitions/serviceBefore1977';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import BenefitsRelinquishmentField from '../BenefitsRelinquishmentField';

import {
  transform,
  benefitsEligibilityBox,
  benefitsRelinquishmentWarning,
  benefitsRelinquishmentLabels,
  benefitsRelinquishedDescription,
  prefillTransformer,
  reserveKickerWarning,
  SeventeenOrOlder,
  eighteenOrOver,
  ageWarning,
} from '../helpers';

import { urlMigration } from '../../config/migrations';

import { hasServiceBefore1977 } from '../../utils/helpers.jsx';

import { benefitsLabels } from '../../utils/labels';

const {
  chapter33,
  chapter30,
  chapter1606,
  chapter32,
  seniorRotcScholarshipProgram,
  seniorRotc,
  civilianBenefitsAssistance,
  additionalContributions,
  activeDutyKicker,
  reserveKicker,
  benefitsRelinquished,
  benefitsRelinquishedDate,
  faaFlightCertificatesInformation,
  highSchoolOrGedCompletionDate,
  serviceAcademyGraduationYear,
  secondaryContact,
} = fullSchema1990.properties;

const {
  postHighSchoolTrainings,
  date,
  fullName,
  ssn,
  gender,
  dateRange,
  year,
  currentlyActiveDuty,
  address,
  serviceBefore1977,
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
    serviceBefore1977,
    usaPhone,
  },
  title: 'Apply for education benefits',
  subTitle: 'Form 22-1990',
  // preSubmitInfo,
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

            'view:ageWarningNotification': {
              'ui:description': ageWarning,
              'ui:options': {
                hideIf: formData => {
                  let hideCondition;
                  if (
                    !eighteenOrOver(formData.veteranDateOfBirth) &&
                    SeventeenOrOlder(formData.veteranDateOfBirth)
                  ) {
                    hideCondition = false;
                  } else {
                    hideCondition = true;
                  }

                  if (environment.isProduction()) {
                    // delete this statement when going to prod
                    hideCondition = true;
                  }
                  return hideCondition;
                },
              },
            },

            minorHighSchoolQuestions: {
              'ui:options': {
                expandUnder: 'view:ageWarningNotification',
                hideIf: formData => eighteenOrOver(formData.veteranDateOfBirth),
              },
              minorHighSchoolQuestion: {
                'ui:title':
                  'Applicant has graduated high school or received GED?',
                'ui:widget': 'yesNo',
                /* Uncomment out this required when going to prod and delete other required field */
                // 'ui:required': formData =>
                //   !eighteenOrOver(formData.veteranDateOfBirth),
                'ui:required': formData => {
                  let isRequired = false;
                  if (!eighteenOrOver(formData.veteranDateOfBirth)) {
                    isRequired = true;
                  }
                  if (environment.isProduction()) {
                    isRequired = false;
                  }
                  return isRequired;
                },
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
                  if (environment.isProduction()) {
                    // delete this if statement when going to prod
                    isRequired = false;
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

              'view:ageWarningNotification': {
                type: 'object',
                properties: {},
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
          uiSchema: {
            'ui:description': benefitsEligibilityBox,
            'view:selectedBenefits': {
              'ui:title': 'Select the benefit that is the best match for you.',
              'ui:validations': [validateBooleanGroup],
              'ui:errorMessages': {
                atLeastOne: 'Please select at least one benefit',
              },
              'ui:options': {
                showFieldLabel: true,
              },
              chapter33: {
                'ui:title': benefitsLabels.chapter33,
                'ui:options': {
                  expandUnderClassNames: 'schemaform-expandUnder-indent',
                },
              },
              'view:chapter33ExpandedContent': {
                'ui:description': benefitsLabels.chapter33Description,
                'ui:options': {
                  expandUnder: 'chapter33',
                },
              },
              chapter30: {
                'ui:title': benefitsLabels.chapter30,
              },
              chapter1606: {
                'ui:title': benefitsLabels.chapter1606,
              },
              chapter32: {
                'ui:title': benefitsLabels.chapter32,
                'ui:options': {
                  hideIf: () => {
                    return !environment.isProduction();
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['view:selectedBenefits'],
            properties: {
              'view:selectedBenefits': {
                type: 'object',
                properties: {
                  chapter33,
                  'view:chapter33ExpandedContent': {
                    type: 'object',
                    properties: {},
                  },
                  chapter30,
                  chapter1606,
                  chapter32,
                },
              },
            },
          },
        },
        benefitsRelinquishment: {
          title: 'Benefits relinquishment',
          path: 'benefits-eligibility/benefits-relinquishment',
          depends: formData => formData['view:selectedBenefits'].chapter33,
          initialData: {
            'view:benefitsRelinquishedContainer': {
              benefitsRelinquishedDate: moment().format('YYYY-MM-DD'),
            },
          },
          uiSchema: {
            'ui:title': 'Benefits relinquishment',
            'ui:description': benefitsRelinquishmentWarning,
            'view:benefitsRelinquishedContainer': {
              'ui:field': BenefitsRelinquishmentField,
              benefitsRelinquished: {
                'ui:title': 'I choose to give up:',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: benefitsRelinquishmentLabels,
                },
              },
              benefitsRelinquishedDate: merge({}, dateUI('Effective date'), {
                'ui:required': formData =>
                  get(
                    'view:benefitsRelinquishedContainer.benefitsRelinquished',
                    formData,
                  ) !== 'unknown',
              }),
            },
            'view:questionText': {
              'ui:description': benefitsRelinquishedDescription,
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:benefitsRelinquishedContainer': {
                type: 'object',
                required: ['benefitsRelinquished'],
                properties: {
                  benefitsRelinquished,
                  benefitsRelinquishedDate,
                },
              },
              'view:questionText': {
                type: 'object',
                properties: {},
              },
            },
          },
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
            'ui:title': 'Service periods',
            toursOfDuty: merge({}, toursOfDuty.uiSchema, {
              'ui:title': null,
              'ui:description': 'Please record all your periods of service.',
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
            civilianBenefitsAssistance: {
              'ui:title':
                'I am receiving benefits from the U.S. Government as a civilian employee during the same time as I am seeking benefits from VA.',
              'ui:options': {
                hideIf: () => !environment.isProduction(),
              },
            },
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
            'view:reserveKickerWarning': {
              'ui:description': reserveKickerWarning,
              'ui:options': {
                expandUnder: 'reserveKicker',
                hideIf: data =>
                  get(
                    'view:benefitsRelinquishedContainer.benefitsRelinquished',
                    data,
                  ) !== 'chapter30',
              },
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
              civilianBenefitsAssistance,
              additionalContributions,
              activeDutyKicker,
              reserveKicker,
              'view:reserveKickerWarning': {
                type: 'object',
                properties: {},
              },
              'view:activeDutyRepayingPeriod': {
                type: 'boolean',
              },
              activeDutyRepayingPeriod: dateRange,
            },
          },
        },
      },
    },
    educationHistory: {
      title: 'Education history',
      pages: {
        educationHistory: {
          title: 'Education history',
          // There’s only one page in this chapter (right?), so this url seems a
          //  bit heavy-handed.
          path: 'education-history/education-information',
          depends: () => environment.isProduction(),
          uiSchema: {
            highSchoolOrGedCompletionDate: currentOrPastMonthYearUI(
              'When did you earn your high school diploma or equivalency certificate?',
            ),
            postHighSchoolTrainings: postHighSchoolTrainingsUI,
            faaFlightCertificatesInformation: {
              'ui:title':
                'If you have any FAA flight certificates, please list them here.',
              'ui:widget': 'textarea',
            },
          },
          schema: {
            type: 'object',
            properties: {
              highSchoolOrGedCompletionDate,
              postHighSchoolTrainings,
              faaFlightCertificatesInformation,
            },
          },
        },
      },
    },
    employmentHistory: {
      title: 'Employment history',
      depends: () => environment.isProduction(),
      pages: {
        employmentHistory: merge({}, employmentHistoryPage(fullSchema1990), {
          path: 'employment-history/employment-information',
          depends: () => environment.isProduction(),
        }),
      },
    },
    schoolSelection: {
      title: 'School selection',
      pages: {
        schoolSelection: merge(
          {},
          createSchoolSelectionPage(fullSchema1990, {
            fields: [
              'educationProgram',
              'educationObjective',
              'educationStartDate',
              'currentlyActiveDuty',
            ],
            required: ['educationType'],
          }),
          {
            path: 'school-selection/school-information',
            depends: () => environment.isProduction(),
          },
        ),
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
        secondaryContact: {
          title: 'Secondary contact',
          depends: () => environment.isProduction(),
          path: 'personal-information/secondary-contact',
          uiSchema: {
            'ui:title': 'Secondary contact',
            'ui:description':
              'This person should know where you can be reached at all times.',
            secondaryContact: {
              fullName: {
                'ui:title': 'Name',
              },
              phone: phoneUI('Telephone number'),
              'view:address': {
                'ui:title': 'Address',
                sameAddress: {
                  'ui:title':
                    'Address for secondary contact is the same as mine',
                },
                address: merge({}, addressUI('', false), {
                  'ui:options': {
                    hideIf: formData =>
                      formData.secondaryContact &&
                      formData.secondaryContact['view:address'].sameAddress,
                  },
                }),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              secondaryContact: {
                type: 'object',
                properties: {
                  fullName: secondaryContact.properties.fullName,
                  phone: secondaryContact.properties.phone,
                  'view:address': {
                    type: 'object',
                    properties: {
                      sameAddress: secondaryContact.properties.sameAddress,
                      address: addressSchema(fullSchema1990),
                    },
                  },
                },
              },
            },
          },
        },
        dependents: {
          title: 'Dependent information',
          path: 'personal-information/dependents',
          depends: hasServiceBefore1977,
          uiSchema: {
            'ui:title': 'Dependents',
            serviceBefore1977: serviceBefore1977UI,
          },
          schema: {
            type: 'object',
            properties: {
              serviceBefore1977,
            },
          },
        },
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
