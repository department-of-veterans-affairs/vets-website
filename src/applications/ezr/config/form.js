// platform imports
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';

// internal app imports
import manifest from '../manifest.json';
import content from '../locales/en/content.json';
import { SHARED_PATHS, VIEW_FIELD_SCHEMA } from '../utils/constants';
import {
  includeSpousalInformation,
  includeHouseholdInformation,
  isMissingVeteranDob,
  isMissingVeteranGender,
  isSigiEnabled,
  hasDifferentHomeAddress,
  showFinancialStatusAlert,
  spouseDidNotCohabitateWithVeteran,
  spouseAddressDoesNotMatchVeterans,
  includeDependentInformation,
  includeInsuranceInformation,
  collectMedicareInformation,
  includeEmergencyContactInformation,
} from '../utils/helpers/form-config';
import { prefillTransformer } from '../utils/helpers/prefill-transformer';
import { submitTransformer } from '../utils/helpers/submit-transformer';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import DowntimeWarning from '../components/FormAlerts/DowntimeWarning';
import SubmissionErrorAlert from '../components/FormAlerts/SubmissionErrorAlert';
import PreSubmitNotice from '../components/PreSubmitNotice';
import GetFormHelp from '../components/GetFormHelp';
import FormFooter from '../components/FormFooter';

// chapter 1 - Veteran Information
import VeteranProfileInformation from '../components/FormPages/VeteranProfileInformation';
import veteranDateOfBirth from './chapters/veteranInformation/dateOfBirth';
import veteranBirthSex from './chapters/veteranInformation/birthSex';
import veteranGenderIdentity from './chapters/veteranInformation/genderIdentity';
import veteranMailingAddress from './chapters/veteranInformation/mailingAddress';
import veteranHomeAddress from './chapters/veteranInformation/homeAddress';
import veteranContantInformation from './chapters/veteranInformation/contactInformation';

// chapter 2 - Household Information
import maritalStatus from './chapters/householdInformation/maritalStatus';
import spousePersonalInformation from './chapters/householdInformation/spousePersonalInformation';
import spouseAdditionalInformation from './chapters/householdInformation/spouseAdditionalInformation';
import spouseFinancialSupport from './chapters/householdInformation/spouseFinancialSupport';
import spouseContactInformation from './chapters/householdInformation/spouseContactInformation';
import dependentSummary from './chapters/householdInformation/dependentSummary';
import veteranAnnualIncome from './chapters/householdInformation/veteranAnnualIncome';
import spouseAnnualIncome from './chapters/householdInformation/spouseAnnualIncome';
import deductibleExpenses from './chapters/householdInformation/deductibleExpenses';
import DependentSummaryPage from '../components/FormPages/DependentSummary';
import DependentInformationPage from '../components/FormPages/DependentInformation';
import DependentsReviewPage from '../components/FormReview/DependentsReviewPage';
import FinancialConfirmationPage from '../components/FormPages/FinancialStatusConfirmation';

// chapter 3 - Insurance Information
import medicaidEligibility from './chapters/insuranceInformation/medicaid';
import medicarePartAEnrollment from './chapters/insuranceInformation/medicare';
import partAEffectiveDate from './chapters/insuranceInformation/partAEffectiveDate';
import insurancePolicies from './chapters/insuranceInformation/insurancePolicies';
import InsuranceSummaryPage from '../components/FormPages/InsuranceSummary';
import InsurancePolicyInformationPage from '../components/FormPages/InsurancePolicyInformation';
import InsurancePolicyReviewPage from '../components/FormReview/InsurancePolicyReviewPage';

// chapter 4 - Emergency Contact Information
import emergencyContactSummary from './chapters/emergencyContactInformation/contactSummary';
import EmergencyContactSummaryPage from '../components/FormPages/EmergencyContactSummary';
import EmergencyContactInformationPage from '../components/FormPages/EmergencyContactInformation';
import EmergencyContactReviewPage from '../components/FormReview/EmergencyContactReviewPage';

// declare shared paths for custom form page navigation
const {
  insurance: INSURANCE_PATHS,
  dependents: DEPENDENT_PATHS,
  emergencyContacts: EMERGENCY_CONTACT_PATHS,
} = SHARED_PATHS;

// declare schema definitions
const { date } = ezrSchema.definitions;

// declare form config object
const formConfig = {
  title: content['form-title'],
  subTitle: content['form-subtitle'],
  formId: VA_FORM_IDS.FORM_10_10EZR,
  version: 0,
  trackingPrefix: 'ezr-',
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/form1010_ezrs`,
  transformForSubmit: submitTransformer,
  prefillEnabled: true,
  prefillTransformer,
  saveInProgress: {
    messages: {
      inProgress: content['sip-message-in-progress'],
      expired: content['sip-message-expired'],
      saved: content['sip-message-saved'],
    },
  },
  customText: {
    appType: content['sip-text-app-type'],
    appAction: content['sip-text-app-action'],
    continueAppButtonText: content['sip-text-continue-btn-text'],
    startNewAppButtonText: content['sip-text-start-new-btn-text'],
    appSavedSuccessfullyMessage: content['sip-text-app-saved-message'],
    finishAppLaterMessage: content['sip-text-finish-later'],
    reviewPageTitle: content['sip-text-review-page-title'],
    submitButtonText: content['sip-text-submit-btn-text'],
  },
  savedFormMessages: {
    notFound: content['sip-savedform-not-found'],
    noAuth: content['sip-savedform-no-auth'],
  },
  preSubmitInfo: {
    required: true,
    field: 'privacyAgreementAccepted',
    CustomComponent: PreSubmitNotice,
  },
  submissionError: SubmissionErrorAlert,
  downtime: {
    dependencies: [externalServices.es],
    message: DowntimeWarning,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: { date },
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
        dateOfBirth: {
          path: 'veteran-information/date-of-birth',
          title: 'Veteran\u2019s date of birth',
          initialData: {},
          depends: isMissingVeteranDob,
          uiSchema: veteranDateOfBirth.uiSchema,
          schema: veteranDateOfBirth.schema,
        },
        birthSex: {
          path: 'veteran-information/birth-sex',
          title: 'Veteran\u2019s sex assigned at birth',
          initialData: {},
          depends: isMissingVeteranGender,
          uiSchema: veteranBirthSex.uiSchema,
          schema: veteranBirthSex.schema,
        },
        genderIdentity: {
          path: 'veteran-information/gender-identity',
          title: 'Veteran\u2019s gender identity',
          initialData: {},
          depends: isSigiEnabled,
          uiSchema: veteranGenderIdentity.uiSchema,
          schema: veteranGenderIdentity.schema,
        },
        mailingAddress: {
          path: 'veteran-information/mailing-address',
          title: 'Veteran\u2019s mailing address',
          initialData: {},
          uiSchema: veteranMailingAddress.uiSchema,
          schema: veteranMailingAddress.schema,
        },
        homeAddress: {
          path: 'veteran-information/home-address',
          title: 'Veteran\u2019s home address',
          initialData: {},
          depends: hasDifferentHomeAddress,
          uiSchema: veteranHomeAddress.uiSchema,
          schema: veteranHomeAddress.schema,
        },
        contactInformation: {
          path: 'veteran-information/contact-information',
          title: 'Veteran\u2019s contact information',
          initialData: {},
          uiSchema: veteranContantInformation.uiSchema,
          schema: veteranContantInformation.schema,
        },
        /** NOTE: this page needs to live in the "Veteran Info" section to avoid
         * having an empty/inactive "Household Info" accordion on the review page
         * when the user does not need to fill out household financial info
         */
        financialStatusConfirmation: {
          path: 'household-information/financial-information-status',
          title: 'Financial information status',
          depends: showFinancialStatusAlert,
          CustomPage: FinancialConfirmationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
      },
    },
    householdInformation: {
      title: 'Household financial information',
      pages: {
        maritalStatus: {
          path: 'household-information/marital-status',
          title: 'Marital status',
          initialData: {},
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
        veteranAnnualIncome: {
          path: 'household-information/veteran-annual-income',
          title: 'Your annual income',
          initialData: {},
          depends: includeHouseholdInformation,
          uiSchema: veteranAnnualIncome.uiSchema,
          schema: veteranAnnualIncome.schema,
        },
        spouseAnnualIncome: {
          path: 'household-information/spouse-annual-income',
          title: 'Spouse\u2019s annual income',
          initialData: {},
          depends: includeSpousalInformation,
          uiSchema: spouseAnnualIncome.uiSchema,
          schema: spouseAnnualIncome.schema,
        },
        deductibleExpenses: {
          path: 'household-information/deductible-expenses',
          title: 'Deductible expenses',
          initialData: {},
          depends: includeHouseholdInformation,
          uiSchema: deductibleExpenses.uiSchema,
          schema: deductibleExpenses.schema,
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
    emergencyContactInformation: {
      title: 'Emergency contact information',
      pages: {
        contactSummary: {
          path: EMERGENCY_CONTACT_PATHS.summary,
          title: 'Emergency contacts',
          CustomPage: EmergencyContactSummaryPage,
          CustomPageReview: EmergencyContactReviewPage,
          uiSchema: emergencyContactSummary.uiSchema,
          schema: emergencyContactSummary.schema,
        },
        contactInformation: {
          path: EMERGENCY_CONTACT_PATHS.info,
          title: 'Emergency contact information',
          depends: includeEmergencyContactInformation,
          CustomPage: EmergencyContactInformationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
      },
    },
  },
};

export default formConfig;
