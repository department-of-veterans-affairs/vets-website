import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import Confirmation from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import IntroductionPage from 'applications/_mock-form-ae-design-patterns/shared/components/pages/IntroductionPage1010ezr';
import content from 'applications/_mock-form-ae-design-patterns/shared/locales/en/content.json';

import {
  SHARED_PATHS,
  VIEW_FIELD_SCHEMA,
} from 'applications/_mock-form-ae-design-patterns/utils/constants';
import {
  includeSpousalInformation,
  includeHouseholdInformation,
  hasDifferentHomeAddress,
  spouseDidNotCohabitateWithVeteran,
  spouseAddressDoesNotMatchVeterans,
  includeDependentInformation,
  includeInsuranceInformation,
  collectMedicareInformation,
} from 'applications/_mock-form-ae-design-patterns/utils/helpers/form-config';
import { prefillTransformer } from 'applications/_mock-form-ae-design-patterns/utils/helpers/prefill-transformer';

import veteranHomeAddress from './chapters/veteranInformation/homeAddress';
import veteranContactInformation from './chapters/veteranInformation/contactInformation';
import maritalStatus from './chapters/householdInformation/maritalStatus';
import spousePersonalInformation from './chapters/householdInformation/spousePersonalInformation';
import spouseAdditionalInformation from './chapters/householdInformation/spouseAdditionalInformation';
import spouseFinancialSupport from './chapters/householdInformation/spouseFinancialSupport';
import spouseContactInformation from './chapters/householdInformation/spouseContactInformation';
import dependentSummary from './chapters/householdInformation/dependentSummary';
import DependentSummaryPage from '../components/DependentSummary';
import DependentInformationPage from '../components/DependentInformation';
import DependentsReviewPage from '../components/DependentsReviewPage';

import medicaidEligibility from './chapters/insuranceInformation/medicaid';
import medicarePartAEnrollment from './chapters/insuranceInformation/medicare';
import partAEffectiveDate from './chapters/insuranceInformation/partAEffectiveDate';
import insurancePolicies from './chapters/insuranceInformation/insurancePolicies';
import InsuranceSummaryPage from '../components/InsuranceSummary';
import InsurancePolicyInformationPage from '../components/InsurancePolicyInformation';
import InsurancePolicyReviewPage from '../components/InsurancePolicyReviewPage';

import { EditAddress } from '../EditContactInfo';
import { GetFormHelp } from '../../../../shared/components/GetFormHelp';
import VeteranProfileInformation from '../VeteranProfileInformation';
import { MailingAddressInfoPage } from '../MailingAddressInfoPage';

export const errorMessages = {
  missingEmail: 'Add an email address to your profile',
  missingHomePhone: 'Add a home phone number to your profile',
  missingMobilePhone: 'Add a mobile phone number to your profile',
  missingMailingAddress: 'Add a mailing address to your profile',
  invalidMailingAddress: 'Add a valid mailing address to your profile',
};

const {
  insurance: INSURANCE_PATHS,
  dependents: DEPENDENT_PATHS,
} = SHARED_PATHS;

const validateValue = (errors, value, errorMsg) => {
  if (!value) {
    errors.addError?.(errorMessages[errorMsg]);
  }
};

const validateAddress = (errors, address) => {
  validateValue(errors, address.addressLine1, 'missingMailingAddress');
  if (
    !address.city ||
    (address.countryCodeIso2 === 'US' &&
      (!address.stateCode || address.zipCode?.length !== 5))
  ) {
    errors.addError?.(errorMessages.invalidMailingAddress);
  }
};

export const contactInfoValidation = (errors = {}, _fieldData, formData) => {
  const { veteran = {} } = formData || {};

  validateAddress(errors, veteran.address || {});
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/1/ezr/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'ezr',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: Confirmation,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  getHelp: GetFormHelp,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your mock form ae design patterns benefits application (00-1234) is in progress.',
    //   expired: 'Your saved mock form ae design patterns benefits application (00-1234) has expired. If you want to apply for mock form ae design patterns benefits, please start a new application.',
    //   saved: 'Your mock form ae design patterns benefits application has been saved.',
    // },
  },
  version: 0,
  prefillTransformer,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for mock form ae design patterns benefits.',
    noAuth:
      'Please sign in again to continue your application for mock form ae design patterns benefits.',
  },
  title: 'Update your VA health benefits information',
  subTitle: 'Health Benefits Update Form (VA Form 10-10EZR)',
  defaultDefinitions: {},
  chapters: {
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        profileInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran\u2019s personal information',
          CustomPage: VeteranProfileInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
        confirmMailingAddress: {
          title: 'Contact information',
          path: 'veteran-information/confirm-mailing-address',
          uiSchema: {
            'ui:title': ' ',
            'ui:description': MailingAddressInfoPage,
            'ui:required': () => false, // don't allow progressing without all contact info// needed to block form progression
            'ui:options': {
              hideOnReview: true, // We're using the `ReveiwDescription`, so don't show this page
              forceDivWrapper: true, // It's all info and links, so we don't need a fieldset or legend
            },
            'view:doesMailingMatchHomeAddress': yesNoUI(
              content['vet-address-match-title'],
            ),
          },
          schema: {
            type: 'object',
            properties: {
              'view:doesMailingMatchHomeAddress': yesNoSchema,
            },
            required: ['view:doesMailingMatchHomeAddress'],
          },
        },
        editMailingAddress: {
          title: 'Edit your mailing address',
          path: 'veteran-information/edit-mailing-address',
          CustomPage: props =>
            EditAddress({
              ...props,
              contactPath: '1/ezr/veteran-information/confirm-mailing-address',
              saveButtonText: 'Save to profile',
              subTitle:
                'We send your VA letters, bills, and prescriptions to this address.',
            }),
          CustomPageReview: null,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        homeAddress: {
          path: 'veteran-information/home-address',
          title: 'Veteran\u2019s home address',
          // initialData: {},
          depends: hasDifferentHomeAddress,
          uiSchema: veteranHomeAddress.uiSchema,
          schema: veteranHomeAddress.schema,
        },
        contactInformation: {
          path: 'veteran-information/contact-information',
          title: 'Veteran\u2019s contact information',
          // initialData: {},
          uiSchema: veteranContactInformation.uiSchema,
          schema: veteranContactInformation.schema,
        },
      },
    },
    householdInformation: {
      title: 'Household financial information',
      pages: {
        maritalStatus: {
          path: 'household-information/marital-status',
          title: 'Marital status',
          initialData: { 'view:householdEnabled': true },
          depends: includeHouseholdInformation,
          uiSchema: maritalStatus.uiSchema,
          schema: maritalStatus.schema,
        },
        spousePersonalInformation: {
          path: 'household-information/spouse-personal-information',
          title: 'Spouse\u2019s personal information',
          initialData: {},
          depends: includeSpousalInformation,
          uiSchema: spousePersonalInformation.uiSchema,
          schema: spousePersonalInformation.schema,
        },
        spouseAdditionalInformation: {
          path: 'household-information/spouse-additional-information',
          title: 'Spouse\u2019s additional information',
          initialData: {},
          depends: includeSpousalInformation,
          uiSchema: spouseAdditionalInformation.uiSchema,
          schema: spouseAdditionalInformation.schema,
        },
        spouseFinancialSupport: {
          path: 'household-information/spouse-financial-support',
          title: 'Spouse\u2019s financial support',
          depends: spouseDidNotCohabitateWithVeteran,
          uiSchema: spouseFinancialSupport.uiSchema,
          schema: spouseFinancialSupport.schema,
        },
        spouseContactInformation: {
          path: 'household-information/spouse-contact-information',
          title: 'Spouse\u2019s address and phone number',
          initialData: {},
          depends: spouseAddressDoesNotMatchVeterans,
          uiSchema: spouseContactInformation.uiSchema,
          schema: spouseContactInformation.schema,
        },
        dependentSummary: {
          path: DEPENDENT_PATHS.summary,
          title: 'Dependents',
          CustomPage: DependentSummaryPage,
          CustomPageReview: DependentsReviewPage,
          depends: includeHouseholdInformation,
          uiSchema: dependentSummary.uiSchema,
          schema: dependentSummary.schema,
        },
        dependentInformation: {
          path: DEPENDENT_PATHS.info,
          title: 'Dependent information',
          depends: includeDependentInformation,
          CustomPage: DependentInformationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
      },
    },
    insuranceInformation: {
      title: 'Insurance information',
      pages: {
        medicaidEligibility: {
          path: 'insurance-information/medicaid-eligibility',
          title: 'Medicaid eligibility',
          initialData: {},
          uiSchema: medicaidEligibility.uiSchema,
          schema: medicaidEligibility.schema,
        },
        medicarePartAEnrollment: {
          path: 'insurance-information/medicare-part-a-enrollment',
          title: 'Medicare Part A enrollment',
          initialData: {},
          uiSchema: medicarePartAEnrollment.uiSchema,
          schema: medicarePartAEnrollment.schema,
        },
        medicarePartAEffectiveDate: {
          path: 'insurance-information/medicare-part-a-effective-date',
          title: 'Medicare Part A effective date',
          initialData: {},
          depends: collectMedicareInformation,
          uiSchema: partAEffectiveDate.uiSchema,
          schema: partAEffectiveDate.schema,
        },
        insurancePolicies: {
          path: INSURANCE_PATHS.summary,
          title: 'Insurance policies',
          CustomPage: InsuranceSummaryPage,
          CustomPageReview: InsurancePolicyReviewPage,
          uiSchema: insurancePolicies.uiSchema,
          schema: insurancePolicies.schema,
        },
        insurancePolicyInformation: {
          path: INSURANCE_PATHS.info,
          title: 'Insurance policy information',
          depends: includeInsuranceInformation,
          CustomPage: InsurancePolicyInformationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
      },
    },
  },
};

export default formConfig;
