import merge from 'lodash/merge';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import moment from 'moment';
import { createSelector } from 'reselect';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring/exports';
import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import GetFormHelp from '@department-of-veterans-affairs/platform-forms/GetPensionOrBurialFormHelp';
import preSubmitInfo from '@department-of-veterans-affairs/platform-forms/preSubmitInfo';
import * as address from '@department-of-veterans-affairs/platform-forms-system/address';
import bankAccountUI from '@department-of-veterans-affairs/platform-forms/bankAccount';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';

import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import fullNameUI from '@department-of-veterans-affairs/platform-forms-system/fullName';
import ArrayCountWidget from '@department-of-veterans-affairs/platform-forms-system/ArrayCountWidget';
import ssnUI from '@department-of-veterans-affairs/platform-forms-system/ssn';
import fileUploadUI from '@department-of-veterans-affairs/platform-forms-system/definitions/file';
import createNonRequiredFullName from '@department-of-veterans-affairs/platform-forms/nonRequiredFullName';
import currencyUI from '@department-of-veterans-affairs/platform-forms-system/currency';

import {
  getSpouseMarriageTitle,
  getMarriageTitleWithCurrent,
  spouseContribution,
  fileHelp,
  directDepositWarning,
  isMarried,
  uploadMessage,
  dependentsMinItem,
  disabilityDocs,
  schoolAttendanceWarning,
  marriageWarning,
  fdcWarning,
  noFDCWarning,
  expeditedProcessDescription,
  aidAttendanceEvidence,
  dependentWarning,
  expectedIncomeDescription,
  spouseExpectedIncomeDescription,
  submit,
  dependentExpectedIncomeDescription,
} from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import SpouseMarriageTitle from '../components/SpouseMarriageTitle';
import ConfirmationPage from '../containers/ConfirmationPage';
import DependentField from '../components/DependentField';
import ErrorText from '../components/ErrorText';
import FinancialDisclosureDescription from '../components/FinancialDisclosureDescription';
import createHouseholdMemberTitle from '../components/DisclosureTitle';
import netWorthUI from '../definitions/netWorth';
import monthlyIncomeUI from '../definitions/monthlyIncome';
import expectedIncomeUI from '../definitions/expectedIncome';
import { additionalSourcesSchema } from '../definitions/additionalSources';
import otherExpensesUI from '../definitions/otherExpenses';
import applicantInformation from '../pages/applicantInformation';
import mailingAddress from '../pages/mailingAddress';
import contactInformation from '../pages/contactInformation';
import servicePeriods from '../pages/servicePeriods';
import generalHistory from '../pages/generalHistory';
import pow from '../pages/pow';
import socialSecurityDisability from '../pages/socialSecurityDisability';
import medicaidCoverage from '../pages/medicaidCoverage';
import medicaidStatus from '../pages/medicaidStatus';
import medicalCondition from '../pages/medicalCondition';
import nursingHome from '../pages/nursingHome';
import specialMonthlyPension from '../pages/specialMonthlyPension';
import vaTreatmentHistory from '../pages/vaTreatmentHistory';
import federalTreatmentHistory from '../pages/federalTreatmentHistory';
import generateMedicalCentersSchemas from '../pages/medicalCenters';
import currentEmployment from '../pages/currentEmployment';
import generateEmployersSchemas from '../pages/employmentHistory';
import maritalStatus from '../pages/maritalStatus';
import currentSpouse from '../pages/currentSpouse';
import currentSpouseMonthlySupport from '../pages/currentSpouseMonthlySupport';
import currentSpouseMaritalHistory from '../pages/currentSpouseMaritalHistory';
import dateOfCurrentMarriage from '../pages/dateOfCurrentMarriage';
import reasonForCurrentSeparation from '../pages/reasonForCurrentSeparation';

import { validateAfterMarriageDate } from '../validation';
import migrations from '../migrations';

import manifest from '../manifest.json';

const {
  spouseDateOfBirth,
  spouseSocialSecurityNumber,
  spouseVaFileNumber,
  liveWithSpouse,
  reasonForNotLivingWithSpouse,
  spouseIsVeteran,
  monthlySpousePayment,
  dependents,
  noRapidProcessing,
} = fullSchemaPensions.properties;

const {
  fullName,
  usaPhone,
  dateRange,
  date,
  monthlyIncome,
  netWorth,
  marriages,
  expectedIncome,
  ssn,
  centralMailVaFile,
  files,
  otherExpenses,
  bankAccount,
} = fullSchemaPensions.definitions;

const nonRequiredFullName = createNonRequiredFullName(fullName);

const vaMedicalCenters = generateMedicalCentersSchemas(
  'vaMedicalCenters',
  'VA medical centers',
  'Enter all VA medical centers where you have received treatment',
  'VA medical center',
  'VA medical centers',
);

const federalMedicalCenters = generateMedicalCentersSchemas(
  'federalMedicalCenters',
  'Federal medical facilities',
  'Enter all federal medical facilities where you have received treatment within the last year',
  'Federal medical center',
  'Federal medical centers',
);

const currentEmployers = generateEmployersSchemas(
  'currentEmployers',
  'Current employment',
  'Enter all your current jobs',
  'What kind of work do you currently do?',
  'How many hours per week do you work on average?',
  'Job title',
  'Current employers',
);

const previousEmployers = generateEmployersSchemas(
  'previousEmployers',
  'Previous employment',
  'Enter all the previous jobs you held the last time you worked',
  'What kind of work did you do?',
  'How many hours per week did you work on average?',
  'What was your job title?',
  'Previous employers',
  4,
  true,
);

function isUnder65(formData) {
  return moment()
    .startOf('day')
    .subtract(65, 'years')
    .isBefore(formData.veteranDateOfBirth);
}

function isBetween18And23(childDOB) {
  return moment(childDOB).isBetween(
    moment()
      .startOf('day')
      .subtract(23, 'years'),
    moment()
      .startOf('day')
      .subtract(18, 'years'),
  );
}

// Checks to see if they’re under 17.75 years old
function isEligibleForDisabilitySupport(childDOB) {
  return moment()
    .startOf('day')
    .subtract(17, 'years')
    .subtract(9, 'months')
    .isBefore(childDOB);
}

function isCurrentMarriage(form, index) {
  const numMarriages = form && form.marriages ? form.marriages.length : 0;
  return isMarried(form) && numMarriages - 1 === index;
}

function usingDirectDeposit(formData) {
  return formData['view:noDirectDeposit'] !== true;
}

const marriageProperties = marriages.items.properties;

const marriageType = {
  ...marriageProperties.marriageType,
  enum: ['Ceremonial', 'Common-law', 'Proxy', 'Tribal', 'Other'],
};

const reasonForSeparation = {
  ...marriageProperties.reasonForSeparation,
  enum: ['Widowed', 'Divorced'],
};

function createSpouseLabelSelector(nameTemplate) {
  return createSelector(
    form =>
      form.marriages && form.marriages.length
        ? form.marriages[form.marriages.length - 1].spouseFullName
        : null,
    spouseFullName => {
      if (spouseFullName) {
        return {
          title: nameTemplate(spouseFullName),
        };
      }

      return {
        title: null,
      };
    },
  );
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'pensions-527EZ-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  formId: VA_FORM_IDS.FORM_21P_527EZ,
  saveInProgress: {
    messages: {
      inProgress: 'Your Veterans pension benefits is in progress.',
      expired:
        'Your saved Veterans pension benefits has expired. If you want to apply for Veterans pension benefits application (21-527EZ), please start a new application.',
      saved: 'Your Veterans pension benefits application has been saved.',
    },
  },
  version: 3,
  migrations,
  prefillEnabled: true,
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for pension benefits.',
    noAuth:
      'Please sign in again to resume your application for pension benefits.',
  },
  title: 'Apply for pension benefits',
  subTitle: 'Form 21P-527EZ',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    address: address.schema(fullSchemaPensions),
    additionalSources: additionalSourcesSchema(fullSchemaPensions),
    date,
    dateRange,
    usaPhone,
    fullName,
    ssn,
    centralMailVaFile,
    monthlyIncome,
    expectedIncome,
    netWorth,
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation: {
          path: 'applicant/information',
          title: 'Applicant information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
        },
        mailingAddress: {
          title: 'Mailing address',
          path: 'applicant/mail-address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          title: 'Contact information',
          path: 'applicant/contact',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },
    militaryHistory: {
      title: 'Military history',
      pages: {
        servicePeriods: {
          path: 'military/history',
          title: 'Service periods',
          uiSchema: servicePeriods.uiSchema,
          schema: servicePeriods.schema,
        },
        general: {
          path: 'military/general',
          title: 'General history',
          uiSchema: generalHistory.uiSchema,
          schema: generalHistory.schema,
        },
        pow: {
          path: 'military/pow',
          title: 'POW status',
          uiSchema: pow.uiSchema,
          schema: pow.schema,
        },
      },
    },
    healthAndEmploymentInformation: {
      title: 'Health and employment information',
      pages: {
        socialSecurityDisability: {
          title: 'Social Security disability',
          path: 'medical/history/social-security-disability',
          depends: isUnder65,
          uiSchema: socialSecurityDisability.uiSchema,
          schema: socialSecurityDisability.schema,
        },
        medicalCondition: {
          title: 'Medical condition',
          path: 'medical/history/condition',
          depends: formData => {
            return formData.socialSecurityDisability !== true;
          },
          uiSchema: medicalCondition.uiSchema,
          schema: medicalCondition.schema,
        },
        nursingHome: {
          title: 'Nursing home information',
          path: 'medical/history/nursing-home',
          uiSchema: nursingHome.uiSchema,
          schema: nursingHome.schema,
        },
        medicaidCoverage: {
          title: 'Medicaid coverage',
          path: 'medical/history/nursing/medicaid',
          depends: formData => {
            return formData.nursingHome !== false;
          },
          uiSchema: medicaidCoverage.uiSchema,
          schema: medicaidCoverage.schema,
        },
        medicaidStatus: {
          title: 'Medicaid application status',
          path: 'medical/history/nursing/medicaid/status',
          depends: formData => {
            return formData.medicaidCoverage !== true;
          },
          uiSchema: medicaidStatus.uiSchema,
          schema: medicaidStatus.schema,
        },
        specialMonthlyPension: {
          title: 'Special monthly pension',
          path: 'medical/history/monthly-pension',
          uiSchema: specialMonthlyPension.uiSchema,
          schema: specialMonthlyPension.schema,
        },
        vaTreatmentHistory: {
          title: 'Treatment from a VA medical center',
          path: 'medical/history/va-treatment',
          uiSchema: vaTreatmentHistory.uiSchema,
          schema: vaTreatmentHistory.schema,
        },
        vaMedicalCenters: {
          title: 'VA medical centers',
          path: 'medical/history/va-treatment/medical-centers',
          depends: formData => {
            return formData.vaTreatmentHistory !== false;
          },
          uiSchema: vaMedicalCenters.uiSchema,
          schema: vaMedicalCenters.schema,
        },
        federalTreatmentHistory: {
          title: 'Treatment from federal medical facilities',
          path: 'medical/history/federal-treatment',
          uiSchema: federalTreatmentHistory.uiSchema,
          schema: federalTreatmentHistory.schema,
        },
        federalMedicalCenters: {
          title: 'Federal medical facilities',
          path: 'medical/history/federal-treatment/medical-centers',
          depends: formData => {
            return formData.federalTreatmentHistory !== false;
          },
          uiSchema: federalMedicalCenters.uiSchema,
          schema: federalMedicalCenters.schema,
        },
        currentEmployment: {
          title: 'Current employment',
          path: 'employment/current',
          depends: isUnder65,
          uiSchema: currentEmployment.uiSchema,
          schema: currentEmployment.schema,
        },
        currentEmploymentHistory: {
          title: 'Current employment',
          path: 'employment/current/history',
          depends: formData => {
            return formData.currentEmployment !== false;
          },
          uiSchema: currentEmployers.uiSchema,
          schema: currentEmployers.schema,
        },
        previousEmploymentHistory: {
          title: 'Previous employment',
          path: 'employment/previous/history',
          depends: formData => {
            return formData.currentEmployment !== true;
          },
          uiSchema: previousEmployers.uiSchema,
          schema: previousEmployers.schema,
        },
      },
    },
    householdInformation: {
      title: 'Household information',
      pages: {
        maritalStatus: {
          title: 'Marital status',
          path: 'household/marital-status',
          uiSchema: maritalStatus.uiSchema,
          schema: maritalStatus.schema,
        },
        currentSpouse: {
          title: 'Current spouse’s name',
          path: 'household/marital-status/current-spouse',
          depends: isMarried,
          uiSchema: currentSpouse.uiSchema,
          schema: currentSpouse.schema,
        },
        dateOfCurrentMarriage: {
          title: 'Current marriage information',
          path: 'household/marital-status/current-marriage',
          depends: isMarried,
          uiSchema: dateOfCurrentMarriage.uiSchema,
          schema: dateOfCurrentMarriage.schema,
        },
        currentSpouseMonthlySupport: {
          title: 'Financial support for you spouse',
          path: 'household/marital-status/spouse-monthly-support',
          depends: isMarried,
          uiSchema: currentSpouseMonthlySupport.uiSchema,
          schema: currentSpouseMonthlySupport.schema,
        reasonForCurrentSeparation: {
          title: 'Reason for separation',
          path: 'household/marital-status/reason-for-separation',
          depends: formData => {
            return formData.maritalStatus === 'Separated';
          },
          uiSchema: reasonForCurrentSeparation.uiSchema,
          schema: reasonForCurrentSeparation.schema,
        },
        currentSpouseMaritalHistory: {
          title: 'Current spouse marital history',
          path: 'household/marital-status/spouse-marital-history',
          depends: isMarried,
          uiSchema: currentSpouseMaritalHistory.uiSchema,
          schema: currentSpouseMaritalHistory.schema,
        },
        marriageInfo: {
          title: 'Marriage history',
          path: 'household/marriage-info',
          depends: formData => {
            return formData.maritalStatus !== 'Never Married';
          },
          uiSchema: {
            marriages: {
              'ui:title': 'How many times have you been married?',
              'ui:widget': ArrayCountWidget,
              'ui:field': 'StringField',
              'ui:options': {
                showFieldLabel: 'label',
                keepInPageOnReview: true,
              },
              'ui:errorMessages': {
                required: 'You must enter at least 1 marriage',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['marriages'],
            properties: {
              marriages,
            },
          },
        },
        marriageHistory: {
          title: (form, { pagePerItemIndex } = { pagePerItemIndex: 0 }) =>
            getMarriageTitleWithCurrent(form, pagePerItemIndex),
          path: 'household/marriages/:index',
          showPagePerItem: true,
          arrayPath: 'marriages',
          uiSchema: {
            marriages: {
              items: {
                'ui:options': {
                  updateSchema: (form, schema, uiSchema, index) => ({
                    title: getMarriageTitleWithCurrent(form, index),
                  }),
                },
                spouseFullName: merge({}, fullNameUI, {
                  first: {
                    'ui:title': 'Spouse first name',
                  },
                  last: {
                    'ui:title': 'Spouse last name',
                  },
                  middle: {
                    'ui:title': 'Spouse middle name',
                  },
                  suffix: {
                    'ui:title': 'Spouse suffix',
                  },
                }),
                dateOfMarriage: currentOrPastDateUI('Date of marriage'),
                locationOfMarriage: {
                  'ui:title':
                    'Place of marriage (city and state or foreign country)',
                },
                marriageType: {
                  'ui:title': 'Type of marriage',
                  'ui:widget': 'radio',
                },
                otherExplanation: {
                  'ui:title': 'Please specify',
                  'ui:required': (form, index) =>
                    get(['marriages', index, 'marriageType'], form) === 'Other',
                  'ui:options': {
                    expandUnder: 'marriageType',
                    expandUnderCondition: 'Other',
                  },
                },
                'view:marriageWarning': {
                  'ui:description': marriageWarning,
                  'ui:options': {
                    hideIf: (form, index) =>
                      get(['marriages', index, 'marriageType'], form) !==
                      'Common-law',
                  },
                },
                'view:pastMarriage': {
                  'ui:options': {
                    hideIf: isCurrentMarriage,
                  },
                  reasonForSeparation: {
                    'ui:title': 'How did marriage end?',
                    'ui:widget': 'radio',
                    'ui:required': (...args) => !isCurrentMarriage(...args),
                  },
                  dateOfSeparation: {
                    ...currentOrPastDateUI('Date marriage ended'),
                    'ui:required': (...args) => !isCurrentMarriage(...args),
                    'ui:validations': [validateAfterMarriageDate],
                  },

                  locationOfSeparation: {
                    'ui:title':
                      'Place marriage ended (city and state or foreign country)',
                    'ui:required': (...args) => !isCurrentMarriage(...args),
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              marriages: {
                type: 'array',
                items: {
                  type: 'object',
                  required: [
                    'spouseFullName',
                    'dateOfMarriage',
                    'locationOfMarriage',
                    'marriageType',
                  ],
                  properties: {
                    spouseFullName: marriageProperties.spouseFullName,
                    dateOfMarriage: marriageProperties.dateOfMarriage,
                    locationOfMarriage: marriageProperties.locationOfMarriage,
                    marriageType,
                    otherExplanation: marriageProperties.otherExplanation,
                    'view:marriageWarning': { type: 'object', properties: {} },
                    'view:pastMarriage': {
                      type: 'object',
                      properties: {
                        reasonForSeparation,
                        dateOfSeparation: marriageProperties.dateOfSeparation,
                        locationOfSeparation:
                          marriageProperties.locationOfSeparation,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        spouseInfo: {
          title: 'Spouse information',
          path: 'household/spouse-info',
          depends: isMarried,
          uiSchema: {
            'ui:title': 'Spouse information',
            spouseDateOfBirth: merge({}, currentOrPastDateUI(''), {
              'ui:options': {
                updateSchema: createSpouseLabelSelector(
                  spouseName =>
                    `${spouseName.first} ${spouseName.last}’s date of birth`,
                ),
              },
            }),
            spouseSocialSecurityNumber: merge({}, ssnUI, {
              'ui:title': '',
              'ui:options': {
                updateSchema: createSpouseLabelSelector(
                  spouseName =>
                    `${spouseName.first} ${
                      spouseName.last
                    }’s Social Security number`,
                ),
              },
            }),
            spouseIsVeteran: {
              'ui:widget': 'yesNo',
              'ui:options': {
                updateSchema: createSpouseLabelSelector(
                  spouseName =>
                    `Is ${spouseName.first} ${spouseName.last} also a Veteran?`,
                ),
              },
            },
            spouseVaFileNumber: {
              'ui:title': 'What is their VA file number?',
              'ui:options': {
                expandUnder: 'spouseIsVeteran',
              },
              'ui:errorMessages': {
                pattern: 'Your VA file number must be 8 or 9 digits',
              },
            },
            liveWithSpouse: {
              'ui:widget': 'yesNo',
              'ui:options': {
                updateSchema: createSpouseLabelSelector(
                  spouseName =>
                    `Do you live with ${spouseName.first} ${spouseName.last}?`,
                ),
              },
            },
            spouseAddress: merge(
              {},
              address.uiSchema(
                'Spouse address',
                false,
                form => form.liveWithSpouse === false,
              ),
              {
                'ui:options': {
                  expandUnder: 'liveWithSpouse',
                  expandUnderCondition: false,
                },
              },
            ),
            reasonForNotLivingWithSpouse: {
              'ui:title':
                'What is the reason you do not live with your spouse?',
              'ui:required': form => form.liveWithSpouse === false,
              'ui:options': {
                expandUnder: 'liveWithSpouse',
                expandUnderCondition: false,
              },
            },
            monthlySpousePayment: merge({}, currencyUI(spouseContribution), {
              'ui:required': form => form.liveWithSpouse === false,
              'ui:options': {
                expandUnder: 'liveWithSpouse',
                expandUnderCondition: false,
              },
            }),
            spouseMarriages: {
              'ui:title':
                'How many times has your spouse been married (including current marriage)?',
              'ui:widget': ArrayCountWidget,
              'ui:field': 'StringField',
              'ui:options': {
                showFieldLabel: 'label',
                keepInPageOnReview: true,
                countOffset: -1,
              },
              'ui:errorMessages': {
                required: 'You must enter at least 1 marriage',
              },
            },
          },
          schema: {
            type: 'object',
            required: [
              'spouseDateOfBirth',
              'spouseSocialSecurityNumber',
              'spouseIsVeteran',
              'liveWithSpouse',
              'spouseMarriages',
            ],
            properties: {
              spouseDateOfBirth,
              spouseSocialSecurityNumber,
              spouseIsVeteran,
              spouseVaFileNumber,
              liveWithSpouse,
              spouseAddress: address.schema(fullSchemaPensions),
              reasonForNotLivingWithSpouse,
              monthlySpousePayment,
              spouseMarriages: marriages,
            },
          },
        },
        spouseMarriageHistory: {
          title: (form, { pagePerItemIndex } = { pagePerItemIndex: 0 }) =>
            getSpouseMarriageTitle(pagePerItemIndex),
          path: 'household/spouse-marriages/:index',
          depends: isMarried,
          showPagePerItem: true,
          arrayPath: 'spouseMarriages',
          uiSchema: {
            spouseMarriages: {
              items: {
                'ui:title': SpouseMarriageTitle,
                spouseFullName: merge({}, fullNameUI, {
                  first: {
                    'ui:title': 'Their spouse’s first name',
                  },
                  last: {
                    'ui:title': 'Their spouse’s last name',
                  },
                  middle: {
                    'ui:title': 'Their spouse’s middle name',
                  },
                  suffix: {
                    'ui:title': 'Their spouse’s suffix',
                  },
                }),
                dateOfMarriage: merge({}, currentOrPastDateUI(''), {
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(
                      spouseName =>
                        `Date of ${spouseName.first} ${
                          spouseName.last
                        }’s marriage`,
                    ),
                  },
                }),
                locationOfMarriage: {
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(
                      spouseName =>
                        `Place of ${spouseName.first} ${
                          spouseName.last
                        }’s marriage (city and state or foreign country)`,
                    ),
                  },
                },
                marriageType: {
                  'ui:title': 'Type of marriage',
                  'ui:widget': 'radio',
                },
                otherExplanation: {
                  'ui:title': 'Please specify',
                  'ui:required': (form, index) =>
                    get(['spouseMarriages', index, 'marriageType'], form) ===
                    'Other',
                  'ui:options': {
                    expandUnder: 'marriageType',
                    expandUnderCondition: 'Other',
                  },
                },
                'view:marriageWarning': {
                  'ui:description': marriageWarning,
                  'ui:options': {
                    hideIf: (form, index) =>
                      get(['spouseMarriages', index, 'marriageType'], form) !==
                      'Common-law',
                  },
                },
                reasonForSeparation: {
                  'ui:title': 'Why did the marriage end?',
                  'ui:widget': 'radio',
                },
                dateOfSeparation: {
                  ...currentOrPastDateUI('Date marriage ended'),
                  'ui:validations': [validateAfterMarriageDate],
                },

                locationOfSeparation: {
                  'ui:title':
                    'Place marriage ended (city and state or foreign country)',
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              spouseMarriages: {
                type: 'array',
                items: {
                  type: 'object',
                  required: [
                    'spouseFullName',
                    'dateOfMarriage',
                    'marriageType',
                    'locationOfMarriage',
                    'reasonForSeparation',
                    'dateOfSeparation',
                    'locationOfSeparation',
                  ],
                  properties: {
                    dateOfMarriage: marriageProperties.dateOfMarriage,
                    locationOfMarriage: marriageProperties.locationOfMarriage,
                    spouseFullName: marriageProperties.spouseFullName,
                    marriageType,
                    otherExplanation: marriageProperties.otherExplanation,
                    'view:marriageWarning': { type: 'object', properties: {} },
                    reasonForSeparation,
                    dateOfSeparation: marriageProperties.dateOfSeparation,
                    locationOfSeparation:
                      marriageProperties.locationOfSeparation,
                  },
                },
              },
            },
          },
        },
        dependents: {
          title: 'Dependent children',
          path: 'household/dependents',
          uiSchema: {
            'ui:title': 'Dependent children',
            'view:hasDependents': {
              'ui:title': 'Do you have any dependent children?',
              'ui:widget': 'yesNo',
            },
            dependents: {
              'ui:options': {
                itemName: 'Dependent',
                expandUnder: 'view:hasDependents',
                viewField: DependentField,
              },
              'ui:errorMessages': {
                minItems: dependentsMinItem,
              },
              items: {
                fullName: fullNameUI,
                childDateOfBirth: currentOrPastDateUI('Date of birth'),
              },
            },
          },
          schema: {
            type: 'object',
            required: ['view:hasDependents'],
            properties: {
              'view:hasDependents': {
                type: 'boolean',
              },
              dependents: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['fullName', 'childDateOfBirth'],
                  properties: {
                    fullName: dependents.items.properties.fullName,
                    childDateOfBirth:
                      dependents.items.properties.childDateOfBirth,
                  },
                },
              },
            },
          },
        },
        childrenInformation: {
          path: 'household/dependents/children/information/:index',
          title: item =>
            `${item.fullName.first || ''} ${item.fullName.last ||
              ''} information`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: [
                    'childPlaceOfBirth',
                    'childRelationship',
                    'previouslyMarried',
                  ],
                  properties: {
                    childPlaceOfBirth:
                      dependents.items.properties.childPlaceOfBirth,
                    childSocialSecurityNumber:
                      dependents.items.properties.childSocialSecurityNumber,
                    'view:noSSN': { type: 'boolean' },
                    childRelationship:
                      dependents.items.properties.childRelationship,
                    attendingCollege:
                      dependents.items.properties.attendingCollege,
                    'view:schoolWarning': {
                      type: 'object',
                      properties: {},
                    },
                    disabled: dependents.items.properties.disabled,
                    'view:disabilityDocs': {
                      type: 'object',
                      properties: {},
                    },
                    'view:dependentWarning': {
                      type: 'object',
                      properties: {},
                    },
                    previouslyMarried:
                      dependents.items.properties.previouslyMarried,
                    married: dependents.items.properties.married,
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle(
                  'fullName',
                  'Information',
                ),
                childPlaceOfBirth: {
                  'ui:title':
                    'Place of birth (city and state or foreign country)',
                },
                childSocialSecurityNumber: merge({}, ssnUI, {
                  'ui:title': 'Social Security number',
                  'ui:required': (formData, index) =>
                    !get(`dependents.${index}.view:noSSN`, formData),
                }),
                'view:noSSN': {
                  'ui:title':
                    'Does not have a Social Security number (foreign national, etc.)',
                },
                childRelationship: {
                  'ui:title': 'Relationship',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: {
                      biological: 'Biological child',
                      adopted: 'Adopted child',
                      stepchild: 'Stepchild',
                    },
                  },
                },
                attendingCollege: {
                  'ui:title': 'Is your child in school?',
                  'ui:widget': 'yesNo',
                  'ui:required': (formData, index) =>
                    isBetween18And23(
                      get(['dependents', index, 'childDateOfBirth'], formData),
                    ),
                  'ui:options': {
                    hideIf: (formData, index) =>
                      !isBetween18And23(
                        get(
                          ['dependents', index, 'childDateOfBirth'],
                          formData,
                        ),
                      ),
                  },
                },
                'view:schoolWarning': {
                  'ui:description': schoolAttendanceWarning,
                  'ui:options': {
                    expandUnder: 'attendingCollege',
                  },
                },
                disabled: {
                  'ui:title': 'Is your child seriously disabled?',
                  'ui:required': (formData, index) =>
                    !isEligibleForDisabilitySupport(
                      get(['dependents', index, 'childDateOfBirth'], formData),
                    ),
                  'ui:options': {
                    hideIf: (formData, index) =>
                      isEligibleForDisabilitySupport(
                        get(
                          ['dependents', index, 'childDateOfBirth'],
                          formData,
                        ),
                      ),
                  },
                  'ui:widget': 'yesNo',
                },
                'view:disabilityDocs': {
                  'ui:description': disabilityDocs,
                  'ui:options': {
                    expandUnder: 'disabled',
                  },
                },
                'view:dependentWarning': {
                  'ui:description': dependentWarning,
                  'ui:options': {
                    hideIf: (formData, index) =>
                      get(['dependents', index, 'disabled'], formData) !==
                        false ||
                      get(
                        ['dependents', index, 'attendingCollege'],
                        formData,
                      ) !== false,
                  },
                },
                previouslyMarried: {
                  'ui:title': 'Has your child ever been married?',
                  'ui:widget': 'yesNo',
                },
                married: {
                  'ui:title': 'Are they currently married?',
                  'ui:widget': 'yesNo',
                  'ui:required': (formData, index) =>
                    !!get(['dependents', index, 'previouslyMarried'], formData),
                  'ui:options': {
                    expandUnder: 'previouslyMarried',
                  },
                },
              },
            },
          },
        },
        childrenAddress: {
          path: 'household/dependents/children/address/:index',
          title: item =>
            `${item.fullName.first || ''} ${item.fullName.last || ''} address`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['childInHousehold'],
                  properties: {
                    childInHousehold:
                      dependents.items.properties.childInHousehold,
                    childAddress: dependents.items.properties.childAddress,
                    personWhoLivesWithChild:
                      dependents.items.properties.personWhoLivesWithChild,
                    monthlyPayment: dependents.items.properties.monthlyPayment,
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Address'),
                childInHousehold: {
                  'ui:title': 'Does your child live with you?',
                  'ui:widget': 'yesNo',
                },
                childAddress: merge(
                  {},
                  address.uiSchema(
                    'Address',
                    false,
                    (form, index) =>
                      !get(['dependents', index, 'childInHousehold'], form),
                  ),
                  {
                    'ui:options': {
                      expandUnder: 'childInHousehold',
                      expandUnderCondition: false,
                    },
                  },
                ),
                personWhoLivesWithChild: merge({}, fullNameUI, {
                  'ui:title': 'Who do they live with?',
                  'ui:options': {
                    updateSchema: (form, UISchema, schema, index) => {
                      if (
                        !get(['dependents', index, 'childInHousehold'], form)
                      ) {
                        return fullName;
                      }
                      return nonRequiredFullName;
                    },
                    expandUnder: 'childInHousehold',
                    expandUnderCondition: false,
                  },
                }),
                monthlyPayment: merge(
                  {},
                  currencyUI(
                    'How much do you contribute per month to their support?',
                  ),
                  {
                    'ui:required': (form, index) =>
                      !get(['dependents', index, 'childInHousehold'], form),
                    'ui:options': {
                      expandUnder: 'childInHousehold',
                      expandUnderCondition: false,
                    },
                  },
                ),
              },
            },
          },
        },
      },
    },
    financialDisclosure: {
      title: 'Financial disclosure',
      reviewDescription: FinancialDisclosureDescription,
      pages: {
        netWorth: {
          path: 'financial-disclosure/net-worth',
          title: item =>
            `${item.veteranFullName.first} ${
              item.veteranFullName.last
            } net worth`,
          schema: {
            type: 'object',
            required: ['netWorth'],
            properties: {
              netWorth,
            },
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle(
              'veteranFullName',
              'Net worth',
            ),
            'ui:description': 'Bank accounts, investments, and property',
            netWorth: netWorthUI,
          },
        },
        monthlyIncome: {
          path: 'financial-disclosure/monthly-income',
          title: item =>
            `${item.veteranFullName.first} ${
              item.veteranFullName.last
            } monthly income`,
          initialData: {},
          schema: {
            type: 'object',
            required: ['monthlyIncome'],
            properties: {
              monthlyIncome,
            },
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle(
              'veteranFullName',
              'Monthly income',
            ),
            'ui:description':
              'Social Security or other pensions (gross income)',
            monthlyIncome: monthlyIncomeUI,
          },
        },
        expectedIncome: {
          path: 'financial-disclosure/expected-income',
          title: item =>
            `${item.veteranFullName.first} ${
              item.veteranFullName.last
            } expected income`,
          initialData: {},
          schema: {
            type: 'object',
            required: ['expectedIncome'],
            properties: {
              expectedIncome,
            },
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle(
              'veteranFullName',
              'Expected income',
            ),
            'ui:description': expectedIncomeDescription,
            expectedIncome: expectedIncomeUI,
          },
        },
        otherExpenses: {
          path: 'financial-disclosure/other-expenses',
          title: item =>
            `${item.veteranFullName.first} ${
              item.veteranFullName.last
            } expenses`,
          schema: {
            type: 'object',
            required: ['view:hasOtherExpenses'],
            properties: {
              'view:hasOtherExpenses': {
                type: 'boolean',
              },
              otherExpenses,
            },
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle(
              'veteranFullName',
              'Medical, legal, or other unreimbursed expenses',
            ),
            'view:hasOtherExpenses': {
              'ui:title':
                'Do you have any medical, legal or other unreimbursed expenses?',
              'ui:widget': 'yesNo',
              'ui:options': {
                // HACK: Forcing wrapper to be a <div> instead of <dl>
                // in order to avoid breaking accessibility.
                customTitle: ' ',
                useDlWrap: true,
              },
            },
            otherExpenses: merge({}, otherExpensesUI, {
              'ui:options': {
                expandUnder: 'view:hasOtherExpenses',
              },
            }),
          },
        },
        spouseNetWorth: {
          path: 'financial-disclosure/net-worth/spouse',
          title: 'Spouse net worth',
          depends: isMarried,
          initialData: {},
          schema: {
            type: 'object',
            properties: {
              spouseNetWorth: netWorth,
            },
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('spouse', 'Net worth'),
            'ui:description': 'Bank accounts, investments, and property',
            spouseNetWorth: netWorthUI,
          },
        },
        spouseMonthlyIncome: {
          path: 'financial-disclosure/monthly-income/spouse',
          title: 'Spouse monthly income',
          depends: isMarried,
          initialData: {},
          schema: {
            type: 'object',
            properties: {
              spouseMonthlyIncome: monthlyIncome,
            },
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('spouse', 'Monthly income'),
            'ui:description':
              'Social Security or other pensions (gross income)',
            spouseMonthlyIncome: monthlyIncomeUI,
          },
        },
        spouseExpectedIncome: {
          path: 'financial-disclosure/expected-income/spouse',
          title: 'Spouse expected income',
          depends: isMarried,
          initialData: {},
          schema: {
            type: 'object',
            properties: {
              spouseExpectedIncome: expectedIncome,
            },
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('spouse', 'Expected income'),
            'ui:description': spouseExpectedIncomeDescription,
            spouseExpectedIncome: expectedIncomeUI,
          },
        },
        spouseOtherExpenses: {
          path: 'financial-disclosure/other-expenses/spouse',
          depends: isMarried,
          title: 'Spouse other expenses',
          schema: {
            type: 'object',
            required: ['view:spouseHasOtherExpenses'],
            properties: {
              'view:spouseHasOtherExpenses': {
                type: 'boolean',
              },
              spouseOtherExpenses: otherExpenses,
            },
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle(
              'spouse',
              'Medical, legal, or other unreimbursed expenses',
            ),
            'view:spouseHasOtherExpenses': {
              'ui:title':
                'Does your spouse have any medical, legal or other unreimbursed expenses?',
              'ui:widget': 'yesNo',
              'ui:options': {
                // HACK: Forcing wrapper to be a <div> instead of <dl>
                // in order to avoid breaking accessibility.
                customTitle: ' ',
                useDlWrap: true,
              },
            },
            spouseOtherExpenses: merge({}, otherExpensesUI, {
              'ui:options': {
                expandUnder: 'view:spouseHasOtherExpenses',
              },
            }),
          },
        },
        dependentsNetWorth: {
          path: 'financial-disclosure/net-worth/dependents/:index',
          title: item =>
            `${item.fullName.first || ''} ${item.fullName.last ||
              ''} net worth`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    netWorth,
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Net worth'),
                'ui:description': 'Bank accounts, investments, and property',
                netWorth: netWorthUI,
              },
            },
          },
        },
        dependentsMonthlyIncome: {
          path: 'financial-disclosure/monthly-income/dependents/:index',
          title: item =>
            `${item.fullName.first || ''} ${item.fullName.last ||
              ''} monthly income`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          initialData: {},
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    monthlyIncome,
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle(
                  'fullName',
                  'Monthly income',
                ),
                'ui:description':
                  'Social Security or other pensions (gross income)',
                monthlyIncome: monthlyIncomeUI,
              },
            },
          },
        },
        dependentsExpectedIncome: {
          path: 'financial-disclosure/expected-income/dependents/:index',
          title: item =>
            `${item.fullName.first || ''} ${item.fullName.last ||
              ''} expected income`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          initialData: {},
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    expectedIncome,
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle(
                  'fullName',
                  'Expected income',
                ),
                'ui:description': dependentExpectedIncomeDescription,
                expectedIncome: expectedIncomeUI,
              },
            },
          },
        },
        dependentsOtherExpenses: {
          path: 'financial-disclosure/other-expenses/dependents/:index',
          showPagePerItem: true,
          arrayPath: 'dependents',
          title: item =>
            `${item.fullName.first || ''} ${item.fullName.last || ''} expenses`,
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['view:hasOtherExpenses'],
                  properties: {
                    'view:hasOtherExpenses': {
                      type: 'boolean',
                    },
                    otherExpenses,
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle(
                  'fullName',
                  'Medical, legal, or other unreimbursed expenses',
                ),
                'view:hasOtherExpenses': {
                  'ui:title':
                    'Does your child have any medical, legal or other unreimbursed expenses?',
                  'ui:widget': 'yesNo',
                  'ui:options': {
                    // HACK: Forcing this to be a <div> instead of <dl>
                    // in order to avoid breaking accessibility.
                    customTitle: ' ',
                    useDlWrap: true,
                  },
                },
                otherExpenses: merge({}, otherExpensesUI, {
                  'ui:options': {
                    expandUnder: 'view:hasOtherExpenses',
                  },
                }),
              },
            },
          },
        },
      },
    },
    additionalInformation: {
      title: 'Additional information',
      pages: {
        directDeposit: {
          title: 'Direct deposit',
          path: 'additional-information/direct-deposit',
          initialData: {},
          uiSchema: {
            'ui:title': 'Direct deposit',
            'view:noDirectDeposit': {
              'ui:title': 'I don’t want to use direct deposit',
            },
            bankAccount: merge({}, bankAccountUI, {
              'ui:order': [
                'accountType',
                'bankName',
                'accountNumber',
                'routingNumber',
              ],
              'ui:options': {
                hideIf: formData => !usingDirectDeposit(formData),
              },
              bankName: {
                'ui:title': 'Bank name',
              },
              accountType: {
                'ui:required': usingDirectDeposit,
              },
              accountNumber: {
                'ui:required': usingDirectDeposit,
              },
              routingNumber: {
                'ui:required': usingDirectDeposit,
              },
            }),
            'view:stopWarning': {
              'ui:description': directDepositWarning,
              'ui:options': {
                hideIf: usingDirectDeposit,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:noDirectDeposit': {
                type: 'boolean',
              },
              bankAccount,
              'view:stopWarning': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        aidAttendance: {
          path: 'additional-information/aid-attendance',
          title: 'Aid and Attendance and Housebound benefits',
          uiSchema: {
            'ui:title': 'Aid and Attendance and Housebound Benefits',
            'view:evidenceInfo': {
              'ui:description': aidAttendanceEvidence,
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:evidenceInfo': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        documentUpload: {
          title: 'Document upload',
          path: 'documents',
          editModeOnReviewPage: true,
          uiSchema: {
            'ui:title': 'Document upload',
            'ui:description': fileHelp,
            files: fileUploadUI('', {
              fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
              hideLabelText: true,
            }),
            'view:uploadMessage': {
              'ui:description': uploadMessage,
            },
          },
          schema: {
            type: 'object',
            properties: {
              files,
              'view:uploadMessage': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        expedited: {
          title: 'Fully Developed Claim program',
          path: 'additional-information/fdc',
          uiSchema: {
            'ui:description': expeditedProcessDescription,
            noRapidProcessing: {
              'ui:title':
                'Do you want to apply using the Fully Developed Claim program?',
              'ui:widget': 'yesNo',
              'ui:options': {
                yesNoReverse: true,
                labels: {
                  Y: 'Yes, I have uploaded all my documentation.',
                  N:
                    'No, I have some extra information that I will submit to VA later.',
                },
              },
            },
            fdcWarning: {
              'ui:description': fdcWarning,
              'ui:options': {
                expandUnder: 'noRapidProcessing',
                expandUnderCondition: false,
              },
            },
            noFDCWarning: {
              'ui:description': noFDCWarning,
              'ui:options': {
                expandUnder: 'noRapidProcessing',
                expandUnderCondition: true,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              noRapidProcessing,
              fdcWarning: {
                type: 'object',
                properties: {},
              },
              noFDCWarning: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
