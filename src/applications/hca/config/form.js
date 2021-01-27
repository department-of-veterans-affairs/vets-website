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

// chapter 3
import basicInformation from './chapters/vaBenefits/basicInformation';

// chapter 4
import financialDisclosure from './chapters/householdInformation/financialDisclosure';
import spouseInformation from './chapters/householdInformation/spouseInformation';
import dependentInformation from './chapters/householdInformation/dependentInformation';
import annualIncome from './chapters/householdInformation/annualIncome';
import deductibleExpenses from './chapters/householdInformation/deductibleExpenses';

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { states } from 'platform/forms/address';

import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { hasSession } from 'platform/user/profile/utilities';
import environment from 'platform/utilities/environment';

import preSubmitInfo from 'platform/forms/preSubmitInfo';

import DowntimeMessage from '../components/DowntimeMessage';
import ErrorText from '../components/ErrorText';
import FormFooter from '../components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import IDPage from '../containers/IDPage';

import {
  facilityHelp,
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

import { createDependentSchema } from '../definitions/dependent';

import manifest from '../manifest.json';

const dependentSchema = createDependentSchema(fullSchemaHca);

const emptyFacilityList = [];
const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

const {
  isCoveredByHealthInsurance,
  isEnrolledMedicarePartA,
  isEssentialAcaCoverage,
  isMedicaidEligible,
  medicarePartAEffectiveDate,
  vaMedicalFacility,
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
        vaBenefits: basicInformation,
      },
    },
    householdInformation: {
      title: 'Household Information',
      pages: {
        financialDisclosure,
        spouseInformation,
        dependentInformation,
        annualIncome,
        deductibleExpenses,
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
