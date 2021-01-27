import _ from 'lodash/fp';

// chapter 1
import birthInformation from './chapters/veteranInformation/birthInformation';
import veteranInformation from './chapters/veteranInformation/personalnformation';
import demographicInformation from './chapters/veteranInformation/demographicInformation';
import veteranAddress from './chapters/veteranInformation/veteranAddress';
import veteranHomeAddress from './chapters/veteranInformation/veteranHomeAddress';
import contactInformation from './chapters/veteranInformation/contactInformation';

// chapter 2
import serviceInformation from './chapters/militaryService/serviceInformation';
import additionalInformation from './chapters/militaryService/additionalInformation';
import documentUpload from './chapters/militaryService/documentUpload';

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { states } from 'platform/forms/address';
import fullNameUI from 'platform/forms/definitions/fullName';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { hasSession } from 'platform/user/profile/utilities';
import environment from 'platform/utilities/environment';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import preSubmitInfo from 'platform/forms/preSubmitInfo';

import DowntimeMessage from '../components/DowntimeMessage';
import ErrorText from '../components/ErrorText';
import FormFooter from '../components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import IDPage from '../containers/IDPage';

import {
  deductibleExpensesDescription,
  disclosureWarning,
  expensesGreaterThanIncomeWarning,
  expensesLessThanIncome,
  facilityHelp,
  financialDisclosureText,
  incomeDescription,
  isEssentialAcaCoverageDescription,
  medicaidDescription,
  medicalCenterLabels,
  medicalCentersByState,
  medicarePartADescription,
  prefillTransformer,
  transform,
} from '../helpers';

import migrations from './migrations';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ErrorMessage from '../components/ErrorMessage';
import InsuranceProviderView from '../components/InsuranceProviderView';
import DependentView from '../components/DependentView';

import {
  createDependentSchema,
  uiSchema as dependentUI,
  createDependentIncomeSchema,
  dependentIncomeUiSchema,
} from '../definitions/dependent';

import { validateMarriageDate, validateCurrency } from '../validation';

import manifest from '../manifest.json';

const dependentSchema = createDependentSchema(fullSchemaHca);
const dependentIncomeSchema = createDependentIncomeSchema(fullSchemaHca);
const emptyFacilityList = [];
const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

const {
  cohabitedLastYear,
  dateOfMarriage,
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
  deductibleMedicalExpenses,
  dependents,
  discloseFinancialInformation,
  isCoveredByHealthInsurance,
  isEnrolledMedicarePartA,
  isEssentialAcaCoverage,
  isMedicaidEligible,
  medicarePartAEffectiveDate,
  provideSupportLastYear,
  sameAddress,
  spouseDateOfBirth,
  spouseFullName,
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
  spousePhone,
  spouseSocialSecurityNumber,
  vaCompensationType,
  vaMedicalFacility,
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
  wantsInitialVaContact,
} = fullSchemaHca.properties;

const {
  date,
  fullName,
  monetaryValue,
  phone,
  provider,
  ssn,
} = fullSchemaHca.definitions;

const stateLabels = createUSAStateLabels(states);

// For which page needs prefill-message, check
// vets-api/config/form_profile_mappings/1010ez.yml
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/health_care_applications`,
  trackingPrefix: 'hca-',
  formId: VA_FORM_IDS.FORM_10_10EZ,
  saveInProgress: {
    messages: {
      inProgress:
        'Your health care benefits application (10-10EZ) is in progress.',
      expired:
        'Your saved health care benefits application (10-10EZ) has expired. If you want to apply for health care benefits, please start a new application.',
      saved: 'Your health care benefits application has been saved.',
    },
  },
  version: 6,
  migrations,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for health care.',
    noAuth: 'Please sign in again to resume your application for health care.',
  },
  downtime: {
    dependencies: [externalServices.es],
    message: DowntimeMessage,
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  additionalRoutes: [
    {
      path: 'id-form',
      component: IDPage,
      pageKey: 'id-form',
      depends: () => !hasSession(),
    },
  ],
  confirmation: ConfirmationPage,
  submitErrorText: ErrorMessage,
  title: 'Apply for health care',
  subTitle: 'Form 10-10EZ',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    date,
    provider,
    fullName: _.set('properties.middle.maxLength', 30, fullName),
    ssn: ssn.oneOf[0], // Mmm...not a fan.
    phone,
    dependent: dependentSchema,
    monetaryValue,
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation,
        birthInformation,
        demographicInformation,
        veteranAddress,
        veteranHomeAddress,
        contactInformation,
      },
    },
    militaryService: {
      title: 'Military Service',
      pages: {
        serviceInformation,
        additionalInformation,
        documentUpload,
      },
    },
    vaBenefits: {
      title: 'VA Benefits',
      pages: {
        vaBenefits: {
          path: 'va-benefits/basic-information',
          title: 'VA benefits',
          uiSchema: {
            'ui:title': 'Current compensation',
            'ui:description': PrefillMessage,
            vaCompensationType: {
              'ui:title':
                'Which type of VA compensation do you currently receive?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  lowDisability:
                    'Service-connected disability pay for a 10%, 20%, 30%, or 40% disability rating',
                  highDisability:
                    'Service-connected disability pay for a 50% or higher disability rating',
                  pension: 'VA pension',
                  none: 'I don’t receive any VA pay',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['vaCompensationType'],
            properties: {
              vaCompensationType,
            },
          },
        },
      },
    },
    householdInformation: {
      title: 'Household Information',
      pages: {
        financialDisclosure: {
          path: 'household-information/financial-disclosure',
          title: 'Financial disclosure',
          uiSchema: {
            'ui:title': 'Financial disclosure',
            'ui:description': financialDisclosureText,
            discloseFinancialInformation: {
              'ui:title': 'Do you want to provide your financial information?',
              'ui:widget': 'yesNo',
            },
            'view:noDiscloseWarning': {
              'ui:description': disclosureWarning,
              'ui:options': {
                hideIf: form => form.discloseFinancialInformation !== false,
              },
            },
          },
          schema: {
            type: 'object',
            required: ['discloseFinancialInformation'],
            properties: {
              discloseFinancialInformation,
              'view:noDiscloseWarning': emptyObjectSchema,
            },
          },
        },
        spouseInformation: {
          path: 'household-information/spouse-information',
          title: 'Spouse’s information',
          initialData: {},
          depends: formData =>
            formData.discloseFinancialInformation &&
            formData.maritalStatus &&
            (formData.maritalStatus.toLowerCase() === 'married' ||
              formData.maritalStatus.toLowerCase() === 'separated'),
          uiSchema: {
            'ui:title': 'Spouse’s information',
            'ui:description':
              'Please fill this out to the best of your knowledge. The more accurate your responses, the faster we can process your application.',
            spouseFullName: fullNameUI,
            spouseSocialSecurityNumber: _.merge(ssnUI, {
              'ui:title': 'Spouse’s Social Security number',
            }),
            spouseDateOfBirth: currentOrPastDateUI('Date of birth'),
            dateOfMarriage: _.assign(currentOrPastDateUI('Date of marriage'), {
              'ui:validations': [validateMarriageDate],
            }),
            cohabitedLastYear: {
              'ui:title': 'Did your spouse live with you last year?',
              'ui:widget': 'yesNo',
            },
            provideSupportLastYear: {
              'ui:title':
                'If your spouse did not live with you last year, did you provide financial support?',
              'ui:widget': 'yesNo',
              'ui:options': {
                expandUnder: 'cohabitedLastYear',
                expandUnderCondition: false,
              },
            },
            sameAddress: {
              'ui:title': 'Do you have the same address as your spouse?',
              'ui:widget': 'yesNo',
            },
            'view:spouseContactInformation': {
              'ui:title': 'Spouse’s address and telephone number',
              'ui:options': {
                expandUnder: 'sameAddress',
                expandUnderCondition: false,
              },
              spouseAddress: addressUI(
                '',
                true,
                formData => formData.sameAddress === false,
              ),
              spousePhone: phoneUI(),
            },
          },
          schema: {
            type: 'object',
            required: [
              'spouseSocialSecurityNumber',
              'spouseDateOfBirth',
              'dateOfMarriage',
              'sameAddress',
            ],
            properties: {
              spouseFullName,
              spouseSocialSecurityNumber,
              spouseDateOfBirth,
              dateOfMarriage,
              cohabitedLastYear,
              provideSupportLastYear,
              sameAddress,
              'view:spouseContactInformation': {
                type: 'object',
                properties: {
                  spouseAddress: addressSchema(fullSchemaHca),
                  spousePhone,
                },
              },
            },
          },
        },
        dependentInformation: {
          path: 'household-information/dependent-information',
          title: 'Dependent information',
          depends: data => data.discloseFinancialInformation,
          uiSchema: {
            'view:reportDependents': {
              'ui:title': 'Do you have any dependents to report?',
              'ui:widget': 'yesNo',
            },
            dependents: {
              items: dependentUI,
              'ui:options': {
                expandUnder: 'view:reportDependents',
                itemName: 'Dependent',
                hideTitle: true,
                viewField: DependentView,
              },
              'ui:errorMessages': {
                minItems: 'You must add at least one dependent.',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['view:reportDependents'],
            properties: {
              'view:reportDependents': { type: 'boolean' },
              dependents: _.assign(dependents, {
                minItems: 1,
              }),
            },
          },
        },
        annualIncome: {
          path: 'household-information/annual-income',
          title: 'Annual income',
          initialData: {},
          depends: data => data.discloseFinancialInformation,
          uiSchema: {
            'ui:title': 'Annual income',
            'ui:description': incomeDescription,
            veteranGrossIncome: _.set(
              'ui:validations',
              [validateCurrency],
              currencyUI('Veteran gross annual income from employment'),
            ),
            veteranNetIncome: _.set(
              'ui:validations',
              [validateCurrency],
              currencyUI(
                'Veteran net income from your farm, ranch, property or business',
              ),
            ),
            veteranOtherIncome: _.set(
              'ui:validations',
              [validateCurrency],
              currencyUI('Veteran other income amount'),
            ),
            'view:spouseIncome': {
              'ui:title': 'Spouse income',
              'ui:options': {
                hideIf: formData =>
                  !formData.maritalStatus ||
                  (formData.maritalStatus.toLowerCase() !== 'married' &&
                    formData.maritalStatus.toLowerCase() !== 'separated'),
              },
              spouseGrossIncome: _.merge(
                currencyUI('Spouse gross annual income from employment'),
                {
                  'ui:required': formData =>
                    formData.maritalStatus &&
                    (formData.maritalStatus.toLowerCase() === 'married' ||
                      formData.maritalStatus.toLowerCase() === 'separated'),
                  'ui:validations': [validateCurrency],
                },
              ),
              spouseNetIncome: _.merge(
                currencyUI(
                  'Spouse net income from your farm, ranch, property or business',
                ),
                {
                  'ui:required': formData =>
                    formData.maritalStatus &&
                    (formData.maritalStatus.toLowerCase() === 'married' ||
                      formData.maritalStatus.toLowerCase() === 'separated'),
                  'ui:validations': [validateCurrency],
                },
              ),
              spouseOtherIncome: _.merge(
                currencyUI('Spouse other income amount'),
                {
                  'ui:required': formData =>
                    formData.maritalStatus &&
                    (formData.maritalStatus.toLowerCase() === 'married' ||
                      formData.maritalStatus.toLowerCase() === 'separated'),
                  'ui:validations': [validateCurrency],
                },
              ),
            },
            dependents: {
              'ui:field': 'BasicArrayField',
              items: dependentIncomeUiSchema,
              'ui:options': {
                hideIf: formData => !_.get('view:reportDependents', formData),
              },
            },
          },
          schema: {
            type: 'object',
            required: [
              'veteranGrossIncome',
              'veteranNetIncome',
              'veteranOtherIncome',
            ],
            definitions: {
              // Override the default schema and use only the income fields
              dependent: dependentIncomeSchema,
            },
            properties: {
              veteranGrossIncome,
              veteranNetIncome,
              veteranOtherIncome,
              'view:spouseIncome': {
                type: 'object',
                properties: {
                  spouseGrossIncome,
                  spouseNetIncome,
                  spouseOtherIncome,
                },
              },
              dependents: _.merge(dependents, {
                minItems: 1,
              }),
            },
          },
        },
        deductibleExpenses: {
          path: 'household-information/deductible-expenses',
          title: 'Deductible expenses',
          depends: data => data.discloseFinancialInformation,
          uiSchema: {
            'ui:title': 'Previous Calendar Year’s Deductible Expenses',
            'ui:description': deductibleExpensesDescription,
            deductibleMedicalExpenses: _.set(
              'ui:validations',
              [validateCurrency],
              currencyUI(
                'Amount you or your spouse paid in non-reimbursable medical expenses this past year.',
              ),
            ),
            'view:expensesIncomeWarning1': {
              'ui:description': expensesGreaterThanIncomeWarning,
              'ui:options': {
                hideIf: expensesLessThanIncome('deductibleMedicalExpenses'),
              },
            },
            deductibleFuneralExpenses: _.set(
              'ui:validations',
              [validateCurrency],
              currencyUI(
                'Amount you paid in funeral or burial expenses for a deceased spouse or child this past year.',
              ),
            ),
            'view:expensesIncomeWarning2': {
              'ui:description': expensesGreaterThanIncomeWarning,
              'ui:options': {
                hideIf: expensesLessThanIncome('deductibleFuneralExpenses'),
              },
            },
            deductibleEducationExpenses: currencyUI(
              'Amount you paid for anything related to your own education (college or vocational) this past year. Do not list your dependents’ educational expenses.',
            ),
            'view:expensesIncomeWarning3': {
              'ui:description': expensesGreaterThanIncomeWarning,
              'ui:options': {
                hideIf: expensesLessThanIncome('deductibleEducationExpenses'),
              },
            },
          },
          schema: {
            type: 'object',
            required: [
              'deductibleMedicalExpenses',
              'deductibleFuneralExpenses',
              'deductibleEducationExpenses',
            ],
            properties: {
              deductibleMedicalExpenses,
              'view:expensesIncomeWarning1': emptyObjectSchema,
              deductibleFuneralExpenses,
              'view:expensesIncomeWarning2': emptyObjectSchema,
              deductibleEducationExpenses,
              'view:expensesIncomeWarning3': emptyObjectSchema,
            },
          },
        },
      },
    },
    insuranceInformation: {
      title: 'Insurance Information',
      pages: {
        medicare: {
          path: 'insurance-information/medicare',
          title: 'Medicaid or Medicare coverage',
          initialData: {},
          uiSchema: {
            isMedicaidEligible: {
              'ui:title': 'Are you eligible for Medicaid?',
              'ui:description': medicaidDescription,
              'ui:widget': 'yesNo',
            },
            isEnrolledMedicarePartA: {
              'ui:title':
                'Are you enrolled in Medicare Part A (hospital insurance)?',
              'ui:description': medicarePartADescription,
              'ui:widget': 'yesNo',
            },
            medicarePartAEffectiveDate: _.merge(
              currentOrPastDateUI(
                'What is your Medicare Part A effective date?',
              ),
              {
                'ui:required': formData => formData.isEnrolledMedicarePartA,
                'ui:options': {
                  expandUnder: 'isEnrolledMedicarePartA',
                },
              },
            ),
          },
          schema: {
            type: 'object',
            required: ['isMedicaidEligible', 'isEnrolledMedicarePartA'],
            properties: {
              isMedicaidEligible,
              isEnrolledMedicarePartA,
              medicarePartAEffectiveDate,
            },
          },
        },
        general: {
          path: 'insurance-information/general',
          title: 'Other coverage',
          uiSchema: {
            'ui:title': 'Other coverage',
            isCoveredByHealthInsurance: {
              'ui:title':
                'Are you covered by health insurance? (Including coverage through a spouse or another person)',
              'ui:widget': 'yesNo',
            },
            providers: {
              'ui:options': {
                itemName: 'Insurance Policy',
                expandUnder: 'isCoveredByHealthInsurance',
                viewField: InsuranceProviderView,
              },
              'ui:errorMessages': {
                minItems: 'You need to at least one provider.',
              },
              items: {
                insuranceName: {
                  'ui:title': 'Name of provider',
                },
                insurancePolicyHolderName: {
                  'ui:title': 'Name of policyholder',
                },
                insurancePolicyNumber: {
                  'ui:title':
                    'Policy number (either this or the group code is required)',
                  'ui:required': (formData, index) =>
                    !_.get(`providers[${index}].insuranceGroupCode`, formData),
                  'ui:errorMessages': {
                    pattern: 'Please provide a valid policy number.',
                  },
                },
                insuranceGroupCode: {
                  'ui:title':
                    'Group code (either this or policy number is required)',
                  'ui:required': (formData, index) =>
                    !_.get(
                      `providers[${index}].insurancePolicyNumber`,
                      formData,
                    ),
                  'ui:errorMessages': {
                    pattern: 'Please provide a valid group code.',
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['isCoveredByHealthInsurance'],
            properties: {
              isCoveredByHealthInsurance,
              providers: {
                type: 'array',
                minItems: 1,
                items: _.merge(provider, {
                  required: [
                    'insuranceName',
                    'insurancePolicyHolderName',
                    'insurancePolicyNumber',
                    'insuranceGroupCode',
                  ],
                }),
              },
            },
          },
        },
        vaFacility: {
          path: 'insurance-information/va-facility',
          title: 'VA Facility',
          initialData: {
            isEssentialAcaCoverage: false,
          },
          uiSchema: {
            'ui:title': 'VA Facility',
            isEssentialAcaCoverage: {
              'ui:title': isEssentialAcaCoverageDescription,
            },
            'view:preferredFacility': {
              'ui:title': 'Select your preferred VA medical facility',
              'view:facilityState': {
                'ui:title': 'State',
                'ui:options': {
                  labels: stateLabels,
                },
              },
              vaMedicalFacility: {
                'ui:title': 'Center or clinic',
                'ui:options': {
                  labels: medicalCenterLabels,
                  updateSchema: form => {
                    const state = _.get(
                      'view:preferredFacility.view:facilityState',
                      form,
                    );
                    if (state) {
                      return {
                        enum: medicalCentersByState[state] || emptyFacilityList,
                      };
                    }

                    return {
                      enum: emptyFacilityList,
                    };
                  },
                },
              },
            },
            'view:locator': {
              'ui:description': facilityHelp,
            },
            wantsInitialVaContact: {
              'ui:title':
                'Do you want VA to contact you to schedule your first appointment?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              isEssentialAcaCoverage,
              'view:preferredFacility': {
                type: 'object',
                required: ['view:facilityState', 'vaMedicalFacility'],
                properties: {
                  'view:facilityState': {
                    type: 'string',
                    enum: states.USA.map(state => state.value).filter(
                      state => !!medicalCentersByState[state],
                    ),
                  },
                  vaMedicalFacility: _.assign(vaMedicalFacility, {
                    enum: emptyFacilityList,
                  }),
                },
              },
              'view:locator': emptyObjectSchema,
              wantsInitialVaContact,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
