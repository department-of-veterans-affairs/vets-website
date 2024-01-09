import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import moment from 'moment';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from 'applications/vre/components/GetFormHelp';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import * as address from 'platform/forms-system/src/js/definitions/address';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import { VA_FORM_IDS } from 'platform/forms/constants';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';
import ArrayCountWidget from 'platform/forms-system/src/js/widgets/ArrayCountWidget';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import createNonRequiredFullName from 'platform/forms/definitions/nonRequiredFullName';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  getDependentChildTitle,
  getMarriageTitleWithCurrent,
  directDepositWarning,
  isMarried,
  submit,
  createSpouseLabelSelector,
  generateHelpText,
} from '../helpers';
import HomeAcreageValueInput from '../components/HomeAcreageValueInput';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ErrorText from '../components/ErrorText';
import createHouseholdMemberTitle from '../components/DisclosureTitle';

// chapter-pages
import age from './chapters/03-health-and-employment-information/age';
import applicantInformation from './chapters/01-applicant-information/applicantInformation';
import careExpenses from './chapters/05-financial-information/careExpenses';
import contactInformation from './chapters/01-applicant-information/contactInformation';
import currentEmployment from './chapters/03-health-and-employment-information/currentEmployment';
import currentSpouseAddress from './chapters/04-household-information/currentSpouseAddress';
import currentSpouseFormerMarriages from './chapters/04-household-information/currentSpouseFormerMarriages';
import currentSpouseMaritalHistory from './chapters/04-household-information/currentSpouseMaritalHistory';
import currentSpouseMonthlySupport from './chapters/04-household-information/currentSpouseMonthlySupport';
import dependentChildInformation from './chapters/04-household-information/dependentChildInformation';
import hasDependents from './chapters/04-household-information/hasDependents';
import dependentChildren from './chapters/04-household-information/dependentChildren';
import documentUpload from './chapters/06-additional-information/documentUpload';
import fasterClaimProcessing from './chapters/06-additional-information/fasterClaimProcessing';
import federalTreatmentHistory from './chapters/03-health-and-employment-information/federalTreatmentHistory';
import generalHistory from './chapters/02-military-history/generalHistory';
import generateEmployersSchemas from './chapters/03-health-and-employment-information/employmentHistory';
import generateMedicalCentersSchemas from './chapters/03-health-and-employment-information/medicalCenters';
import hasCareExpenses from './chapters/05-financial-information/hasCareExpenses';
import homeAcreageMoreThanTwo from './chapters/05-financial-information/homeAcreageMoreThanTwo';
import homeOwnership from './chapters/05-financial-information/homeOwnership';
import incomeSources from './chapters/05-financial-information/incomeSources';
import mailingAddress from './chapters/01-applicant-information/mailingAddress';
import maritalStatus from './chapters/04-household-information/maritalStatus';
import medicaidCoverage from './chapters/03-health-and-employment-information/medicaidCoverage';
import medicaidStatus from './chapters/03-health-and-employment-information/medicaidStatus';
import medicalCondition from './chapters/03-health-and-employment-information/medicalCondition';
import hasMedicalExpenses from './chapters/05-financial-information/hasMedicalExpenses';
import medicalExpenses from './chapters/05-financial-information/medicalExpenses';
import netWorthEstimation from './chapters/05-financial-information/netWorthEstimation';
import nursingHome from './chapters/03-health-and-employment-information/nursingHome';
import pow from './chapters/02-military-history/pow';
import reasonForCurrentSeparation from './chapters/04-household-information/reasonForCurrentSeparation';
import receivesIncome from './chapters/05-financial-information/receivesIncome';
import servicePeriod from './chapters/02-military-history/servicePeriod';
import socialSecurityDisability from './chapters/03-health-and-employment-information/socialSecurityDisability';
import specialMonthlyPension from './chapters/03-health-and-employment-information/specialMonthlyPension';
import supportingDocuments from './chapters/06-additional-information/supportingDocuments';
import totalNetWorth from './chapters/05-financial-information/totalNetWorth';
import transferredAssets from './chapters/05-financial-information/transferredAssets';
import vaTreatmentHistory from './chapters/03-health-and-employment-information/vaTreatmentHistory';
import landMarketable from './chapters/05-financial-information/landMarketable';

import { validateAfterMarriageDate } from '../validation';
import migrations from '../migrations';
import { marriageTypeLabels } from '../labels';

import manifest from '../manifest.json';

const {
  spouseDateOfBirth,
  spouseSocialSecurityNumber,
  spouseVaFileNumber,
  liveWithSpouse,
  spouseIsVeteran,
  dependents,
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

export function isUnder65(formData, currentDate) {
  const today = currentDate || moment();
  return (
    today
      .startOf('day')
      .subtract(65, 'years')
      .isBefore(formData.veteranDateOfBirth) || !formData.isOver65
  );
}

function showSpouseAddress(form) {
  return (
    isMarried(form) &&
    (form.maritalStatus === 'Separated' ||
      get(['view:liveWithSpouse'], form) === false)
  );
}

function isCurrentMarriage(form, index) {
  const numMarriages = form && form.marriages ? form.marriages.length : 0;
  return isMarried(form) && numMarriages - 1 === index;
}

function isHomeOwnerAndAcreageMorThanTwo(form) {
  return form.homeOwnership === true && form.homeAcreageMoreThanTwo === true;
}

function usingDirectDeposit(formData) {
  return formData['view:noDirectDeposit'] !== true;
}

const marriageProperties = marriages.items.properties;

const marriageType = {
  ...marriageProperties.marriageType,
  enum: [marriageTypeLabels.ceremony, marriageTypeLabels.other],
};

const reasonForSeparation = {
  ...marriageProperties.reasonForSeparation,
  enum: ['Spouse’s death', 'Divorce'],
};

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
  // verifyRequiredPrefill: true,
  // transformForSubmit: transform,
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  // beforeLoad: props => { console.log('form config before load', props); },
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('form loaded', formData, savedForms, returnUrl, formConfig, router);
  // },
  savedFormMessages: {
    notFound: 'Please start over to apply for pension benefits.',
    noAuth:
      'Please sign in again to resume your application for pension benefits.',
  },
  title: 'Apply for pension benefits',
  subTitle: 'Form 21P-527EZ',
  preSubmitInfo,
  // showReviewErrors: true,
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    address: address.schema(fullSchemaPensions),
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
          updateFormData: applicantInformation.updateFormData,
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
        servicePeriod: {
          path: 'military/history',
          title: 'Service period',
          uiSchema: servicePeriod.uiSchema,
          schema: servicePeriod.schema,
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
        age: {
          title: 'Age',
          path: 'medical/history/age',
          uiSchema: age.uiSchema,
          schema: age.schema,
        },
        socialSecurityDisability: {
          title: 'Social Security disability',
          path: 'medical/history/social-security-disability',
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
            return formData.nursingHome === true;
          },
          uiSchema: medicaidCoverage.uiSchema,
          schema: medicaidCoverage.schema,
        },
        medicaidStatus: {
          title: 'Medicaid application status',
          path: 'medical/history/nursing/medicaid/status',
          depends: formData => {
            return (
              formData.nursingHome === true &&
              formData.medicaidCoverage === false
            );
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
            return formData.vaTreatmentHistory === true;
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
            return formData.federalTreatmentHistory === true;
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
            return formData.currentEmployment === true && isUnder65(formData);
          },
          uiSchema: currentEmployers.uiSchema,
          schema: currentEmployers.schema,
        },
        previousEmploymentHistory: {
          title: 'Previous employment',
          path: 'employment/previous/history',
          depends: formData => {
            return formData.currentEmployment === false && isUnder65(formData);
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
        marriageInfo: {
          title: 'Marriage history',
          path: 'household/marriage-info',
          depends: isMarried,
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
          depends: isMarried,
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
                    'ui:title': 'Spouse’s first name',
                  },
                  last: {
                    'ui:title': 'Spouse’s last name',
                  },
                  middle: {
                    'ui:title': 'Spouse’s middle name',
                  },
                  suffix: {
                    'ui:title': 'Spouse’s suffix',
                  },
                }),
                dateOfMarriage: currentOrPastDateUI('Date of marriage'),
                locationOfMarriage: {
                  'ui:title':
                    'Place of marriage (city and state or foreign country)',
                },
                'view:currentMarriage': {
                  'ui:options': {
                    hideIf: (form, index) => !isCurrentMarriage(form, index),
                  },
                  marriageType: {
                    'ui:title': 'How did you get married?',
                    'ui:description': generateHelpText(
                      'You can enter common law, proxy (someone else represented you or your spouse at your marriage ceremony), tribal ceremony, or another way.',
                    ),
                    'ui:widget': 'radio',
                    'ui:required': (...args) => isCurrentMarriage(...args),
                  },
                  otherExplanation: {
                    'ui:title': 'Please specify',
                    'ui:required': (form, index) =>
                      get(['marriages', index, 'marriageType'], form) ===
                      'Other',
                    'ui:options': {
                      expandUnder: 'marriageType',
                      expandUnderCondition: marriageTypeLabels.other,
                    },
                  },
                },
                'view:pastMarriage': {
                  'ui:options': {
                    hideIf: isCurrentMarriage,
                  },
                  reasonForSeparation: {
                    'ui:title': 'How did the marriage end?',
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
                  ],
                  properties: {
                    spouseFullName: marriageProperties.spouseFullName,
                    dateOfMarriage: marriageProperties.dateOfMarriage,
                    locationOfMarriage: marriageProperties.locationOfMarriage,
                    'view:currentMarriage': {
                      type: 'object',
                      properties: {
                        marriageType,
                        otherExplanation: marriageProperties.otherExplanation,
                      },
                    },
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
                yesNoReverse: true,
                labels: {
                  Y: 'No',
                  N: 'Yes',
                },
              },
            },
            spouseVaFileNumber: {
              'ui:title': 'If yes, what is their VA file number?',
              'ui:options': {
                expandUnder: 'spouseIsVeteran',
              },
              'ui:errorMessages': {
                pattern: 'Your VA file number must be 8 or 9 digits',
              },
            },
            'view:liveWithSpouse': {
              'ui:widget': 'yesNo',
              'ui:options': {
                updateSchema: createSpouseLabelSelector(
                  spouseName =>
                    `Do you live with ${spouseName.first} ${spouseName.last}?`,
                ),
              },
            },
          },
          schema: {
            type: 'object',
            required: [
              'spouseDateOfBirth',
              'spouseSocialSecurityNumber',
              'spouseIsVeteran',
              'view:liveWithSpouse',
            ],
            properties: {
              spouseDateOfBirth,
              spouseSocialSecurityNumber,
              spouseIsVeteran,
              spouseVaFileNumber,
              'view:liveWithSpouse': liveWithSpouse,
            },
          },
        },
        reasonForCurrentSeparation: {
          title: 'Reason for separation',
          path: 'household/marital-status/separated',
          depends: formData => {
            return formData.maritalStatus === 'Separated';
          },
          uiSchema: reasonForCurrentSeparation.uiSchema,
          schema: reasonForCurrentSeparation.schema,
        },
        currentSpouseAddress: {
          title: 'Spouse address',
          path: 'household/marital-status/separated/spouse-address',
          depends: form => showSpouseAddress(form),
          uiSchema: currentSpouseAddress.uiSchema,
          schema: currentSpouseAddress.schema,
        },
        currentSpouseMonthlySupport: {
          title: 'Financial support for your spouse',
          path: 'household/marital-status/separated/spouse-monthly-support',
          depends: formData => {
            return formData.maritalStatus === 'Separated';
          },
          uiSchema: currentSpouseMonthlySupport.uiSchema,
          schema: currentSpouseMonthlySupport.schema,
        },
        currentSpouseMaritalHistory: {
          title: 'Current spouse marital history',
          path: 'household/marital-status/spouse-marital-history',
          depends: isMarried,
          uiSchema: currentSpouseMaritalHistory.uiSchema,
          schema: currentSpouseMaritalHistory.schema,
        },
        spouseMarriageHistory: {
          title: 'Spouse’s former marriages',
          path: 'household/marital-status/spouse-marriages',
          depends: formData =>
            isMarried(formData) &&
            formData.currentSpouseMaritalHistory === 'Yes',
          uiSchema: currentSpouseFormerMarriages.uiSchema,
          schema: currentSpouseFormerMarriages.schema,
        },
        hasDependents: {
          title: 'Dependents',
          path: 'household/dependents',
          uiSchema: hasDependents.uiSchema,
          schema: hasDependents.schema,
        },
        dependents: {
          title: 'Dependent children',
          path: 'household/dependents/add',
          depends: form => get(['view:hasDependents'], form) === true,
          uiSchema: dependentChildren.uiSchema,
          schema: dependentChildren.schema,
        },
        dependentChildInformation: {
          path: 'household/dependents/children/information/:index',
          title: item => getDependentChildTitle(item, 'information'),
          depends: form => get(['view:hasDependents'], form) === true,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: dependentChildInformation.schema,
          uiSchema: dependentChildInformation.uiSchema,
        },
        dependentChildAddress: {
          path: 'household/dependents/children/address/:index',
          title: item => getDependentChildTitle(item, 'address'),
          depends: form => get(['view:hasDependents'], form),
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
                    childAddress: addressSchema({
                      omit: ['street3', 'isMilitary'],
                    }),
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
                childAddress: {
                  ...addressUI({
                    omit: ['street3', 'isMilitary'],
                    required: {
                      country: (form, index) =>
                        !get(['dependents', index, 'childInHousehold'], form),
                      street: (form, index) =>
                        !get(['dependents', index, 'childInHousehold'], form),
                      city: (form, index) =>
                        !get(['dependents', index, 'childInHousehold'], form),
                      postalCode: (form, index) =>
                        !get(['dependents', index, 'childInHousehold'], form),
                    },
                  }),
                  'ui:options': {
                    expandUnder: 'childInHousehold',
                    expandUnderCondition: false,
                  },
                },
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
                    "How much do you contribute per month to your child's support?",
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
    financialInformation: {
      title: 'Financial information',
      pages: {
        totalNetWorth: {
          title: 'Total net worth',
          path: 'financial/total-net-worth',
          uiSchema: totalNetWorth.uiSchema,
          schema: totalNetWorth.schema,
        },
        netWorthEstimation: {
          title: 'Net worth estimation',
          path: 'financial/net-worth-estimation',
          depends: formData => formData.totalNetWorth === false,
          uiSchema: netWorthEstimation.uiSchema,
          schema: netWorthEstimation.schema,
        },
        transferredAssets: {
          title: 'Transferred assets',
          path: 'financial/transferred-assets',
          uiSchema: transferredAssets.uiSchema,
          schema: transferredAssets.schema,
        },
        homeOwnership: {
          title: 'Home ownership',
          path: 'financial/home-ownership',
          uiSchema: homeOwnership.uiSchema,
          schema: homeOwnership.schema,
        },
        homeAcreageMoreThanTwo: {
          title: 'Home acreage size',
          path: 'financial/home-ownership/acres',
          depends: formData => {
            return formData.homeOwnership === true;
          },
          uiSchema: homeAcreageMoreThanTwo.uiSchema,
          schema: homeAcreageMoreThanTwo.schema,
        },
        homeAcreageValue: {
          title: 'Home acreage value',
          path: 'financial/home-ownership/acres/value',
          depends: formData => isHomeOwnerAndAcreageMorThanTwo(formData),
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          CustomPage: HomeAcreageValueInput,
          CustomPageReview: null,
        },
        landMarketable: {
          title: 'Land marketable',
          path: 'financial/land-marketable',
          depends: formData => isHomeOwnerAndAcreageMorThanTwo(formData),
          uiSchema: landMarketable.uiSchema,
          schema: landMarketable.schema,
        },
        receivesIncome: {
          title: 'Receives income',
          path: 'financial/receives-income',
          uiSchema: receivesIncome.uiSchema,
          schema: receivesIncome.schema,
        },
        incomeSources: {
          title: 'Gross monthly income',
          path: 'financial/income-sources',
          depends: formData => formData.receivesIncome === true,
          uiSchema: incomeSources.uiSchema,
          schema: incomeSources.schema,
        },
        hasCareExpenses: {
          path: 'financial/care-expenses',
          title: 'Care expenses',
          uiSchema: hasCareExpenses.uiSchema,
          schema: hasCareExpenses.schema,
        },
        careExpenses: {
          path: 'financial/care-expenses/add',
          title: 'Unreimbursed care expenses',
          depends: formData => formData.hasCareExpenses === true,
          uiSchema: careExpenses.uiSchema,
          schema: careExpenses.schema,
        },
        hasMedicalExpenses: {
          path: 'financial/medical-expenses',
          title: 'Medical expenses',
          uiSchema: hasMedicalExpenses.uiSchema,
          schema: hasMedicalExpenses.schema,
        },
        medicalExpenses: {
          path: 'financial/medical-expenses/add',
          title: 'Medical expenses',
          depends: formData => formData.hasMedicalExpenses === true,
          uiSchema: medicalExpenses.uiSchema,
          schema: medicalExpenses.schema,
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
          title: 'Supporting documents',
          path: 'additional-information/supporting-documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        documentUpload: {
          title: 'Document upload',
          path: 'additional-information/document-upload',
          uiSchema: documentUpload.uiSchema,
          schema: documentUpload.schema,
        },
        expedited: {
          title: 'Faster claim processing',
          path: 'additional-information/faster-claim-processing',
          uiSchema: fasterClaimProcessing.uiSchema,
          schema: fasterClaimProcessing.schema,
        },
      },
    },
    // This chapter is here so that the cypress test ends successfully since
    // the form tester will only consider the test a success when it gets to a
    // page which has a URL ending in '/confirmation';
    //
    // This chapter should be entirely removed/replaced once the form has an
    // actual confirmation page.
    confirmation: {
      title: 'Confirmation',
      pages: {
        confirmation: {
          path: 'confirmation',
          title: 'Confirmation',
          // Needs something as a schema. Doesn't matter what.
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
