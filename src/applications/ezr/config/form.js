import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';

// internal app imports
import manifest from '../manifest.json';
import content from '../locales/en/content.json';
import { SHARED_PATHS, VIEW_FIELD_SCHEMA } from '../utils/constants';
import {
  includeSpousalInformationV1,
  includeHouseholdInformation,
  includeHouseholdInformationV1,
  includeHouseholdInformationV2,
  isMissingVeteranDob,
  isMissingVeteranGender,
  hasDifferentHomeAddress,
  teraUploadEnabled,
  includeTeraInformation,
  includeGulfWarServiceDates,
  includePostSept11ServiceDates,
  includeAgentOrangeExposureDates,
  includeOtherExposureDates,
  includeOtherExposureDetails,
  isEmergencyContactsEnabled,
  showFinancialStatusAlert,
  spouseDidNotCohabitateWithVeteranV1,
  spouseAddressDoesNotMatchVeteransV1,
  includeDependentInformation,
  includeInsuranceInformation,
  collectMedicareInformation,
  canVeteranProvideRadiationCleanupResponse,
  canVeteranProvideGulfWarServiceResponse,
  canVeteranProvidePostSept11ServiceResponse,
  canVeteranProvideCombatOperationsResponse,
  canVeteranProvideAgentOrangeResponse,
  includeHouseholdInformationWithV1Prefill,
  includeSpousalInformationWithV1Prefill,
  doesVeteranWantToUpdateServiceInfo,
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
import veteranMailingAddress from './chapters/veteranInformation/mailingAddress';
import veteranHomeAddress from './chapters/veteranInformation/homeAddress';
import veteranContantInformation from './chapters/veteranInformation/contactInformation';
import emergencyContactPages from './chapters/veteranInformation/emergencyContacts';
import nextOfKinPages from './chapters/veteranInformation/nextOfKin';

// chapter 2 - Household Information
import maritalStatus from './chapters/householdInformation/maritalStatus';
import spousePersonalInformation from './chapters/householdInformation/spousePersonalInformation';
import spouseAdditionalInformation from './chapters/householdInformation/spouseAdditionalInformation';
import spouseFinancialSupport from './chapters/householdInformation/spouseFinancialSupport';
import spouseContactInformation from './chapters/householdInformation/spouseContactInformation';
import dependentSummary from './chapters/householdInformation/dependentSummary';
import DependentSummaryPage from '../components/FormPages/DependentSummary';
import DependentInformationPage from '../components/FormPages/DependentInformation';
import DependentsReviewPage from '../components/FormReview/DependentsReviewPage';
import FinancialConfirmationPage from '../components/FormPages/FinancialStatusConfirmation';
import veteranAnnualIncome from './chapters/householdInformation/veteranAnnualIncome';
import spouseAnnualIncome from './chapters/householdInformation/spouseAnnualIncome';
import deductibleExpenses from './chapters/householdInformation/deductibleExpenses';
import FinancialInformationPages from './chapters/householdInformation/financialInformation';
import spousalInformationPages from './chapters/householdInformation/spouseInformation';
import MaritalStatusPage from '../components/FormPages/MaritalStatusPage';

// chapter 3 Military Service
import serviceInformation from './chapters/militaryService/serviceInformation';
import additionalInformation from './chapters/militaryService/additionalInformation';
import reviewServiceInformation from './chapters/militaryService/reviewServiceInformation';
import toxicExposure from './chapters/militaryService/toxicExposure';
import radiationCleanup from './chapters/militaryService/radiationCleanup';
import gulfWarService from './chapters/militaryService/gulfWarService';
import gulfWarServiceDates from './chapters/militaryService/gulfWarServiceDates';
import combatOperationService from './chapters/militaryService/combatOperationService';
import agentOrangeExposure from './chapters/militaryService/agentOrangeExposure';
import agentOrangeExposureDates from './chapters/militaryService/agentOrangeExposureDates';
import otherToxicExposure from './chapters/militaryService/otherToxicExposure';
import otherToxicExposureDetails from './chapters/militaryService/otherToxicExposureDetails';
import otherToxicExposureDates from './chapters/militaryService/otherToxicExposureDates';
import supportingDocuments from './chapters/militaryService/supportingDocuments';

// chapter 4 - Insurance Information
import medicaidEligibility from './chapters/insuranceInformation/medicaid';
import medicarePartAEnrollment from './chapters/insuranceInformation/medicare';
import partAEffectiveDate from './chapters/insuranceInformation/partAEffectiveDate';
import insurancePolicies from './chapters/insuranceInformation/insurancePolicies';
import InsuranceSummaryPage from '../components/FormPages/InsuranceSummary';
import InsurancePolicyInformationPage from '../components/FormPages/InsurancePolicyInformation';
import InsurancePolicyReviewPage from '../components/FormReview/InsurancePolicyReviewPage';
import postSept11Service from './chapters/militaryService/postSept11Service';
import postSept11ServiceDates from './chapters/militaryService/postSept11ServiceDates';

const showServiceHistoryEnabled = () => {
  const state = window?.__STORE__?.getState();
  const featureToggles = state?.featureToggles || {};
  return (
    featureToggles?.ezrServiceHistoryEnabled ||
    featureToggles?.['view:isServiceHistoryEnabled'] ||
    true
  );
};

// declare shared paths for custom form page navigation
const {
  insurance: INSURANCE_PATHS,
  dependents: DEPENDENT_PATHS,
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
  v3SegmentedProgressBar: true,
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
    dependencies: [externalServices['1010ezr']],
    message: DowntimeWarning,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: { date },
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
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
        emergencyContactsSummary: {
          ...emergencyContactPages.emergencyContactsSummary,
          depends: isEmergencyContactsEnabled,
        },
        emergencyContactsPage: {
          ...emergencyContactPages.emergencyContactsPage,
          depends: isEmergencyContactsEnabled,
        },
        emergencyContactsAddressPage: {
          ...emergencyContactPages.emergencyContactsAddressPage,
          depends: isEmergencyContactsEnabled,
        },
        nextOfKinSummary: {
          ...nextOfKinPages.nextOfKinSummary,
          depends: isEmergencyContactsEnabled,
        },
        nextOfKinPage: {
          ...nextOfKinPages.nextOfKinPage,
          depends: isEmergencyContactsEnabled,
        },
        nextOfKinAddressPage: {
          ...nextOfKinPages.nextOfKinAddressPage,
          depends: isEmergencyContactsEnabled,
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
    militaryService: {
      title: 'Military service',
      pages: {
        reviewServiceInformation: {
          path: 'military-service/review-service-information',
          title: 'Review your last military service',
          uiSchema: reviewServiceInformation.uiSchema,
          schema: reviewServiceInformation.schema,
          depends: showServiceHistoryEnabled,
        },
        serviceInformation: {
          path: 'military-service/service-information',
          title: 'Service periods',
          uiSchema: serviceInformation.uiSchema,
          schema: serviceInformation.schema,
          depends: doesVeteranWantToUpdateServiceInfo,
        },
        additionalInformation: {
          path: 'military-service/additional-information',
          title: 'Service history',
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
          depends: doesVeteranWantToUpdateServiceInfo,
        },
        toxicExposure: {
          path: 'military-service/toxic-exposure',
          title: 'Toxic exposure',
          uiSchema: toxicExposure.uiSchema,
          schema: toxicExposure.schema,
        },
        radiationCleanup: {
          path: 'military-service/radiation-cleanup-efforts',
          title: 'Radiation cleanup or response efforts',
          depends: canVeteranProvideRadiationCleanupResponse,
          uiSchema: radiationCleanup.uiSchema,
          schema: radiationCleanup.schema,
        },
        gulfWarService: {
          path: 'military-service/gulf-war-service',
          title: 'Gulf War service locations',
          depends: canVeteranProvideGulfWarServiceResponse,
          uiSchema: gulfWarService.uiSchema,
          schema: gulfWarService.schema,
        },
        gulfWarServiceDates: {
          path: 'military-service/gulf-war-service-dates',
          title: 'Gulf War service dates',
          depends: includeGulfWarServiceDates,
          uiSchema: gulfWarServiceDates.uiSchema,
          schema: gulfWarServiceDates.schema,
        },
        postSept11Service: {
          path: 'military-service/post-sept-11-service',
          title: 'Service post-9/11',
          depends: canVeteranProvidePostSept11ServiceResponse,
          uiSchema: postSept11Service.uiSchema,
          schema: postSept11Service.schema,
        },
        postSept11ServiceDates: {
          path: 'military-service/post-sept-11-service-dates',
          title: 'Post-9/11 service dates',
          depends: includePostSept11ServiceDates,
          uiSchema: postSept11ServiceDates.uiSchema,
          schema: postSept11ServiceDates.schema,
        },
        combatOperationService: {
          path: 'military-service/operation-support',
          title: 'Operations',
          depends: canVeteranProvideCombatOperationsResponse,
          uiSchema: combatOperationService.uiSchema,
          schema: combatOperationService.schema,
        },
        agentOrangeExposure: {
          path: 'military-service/agent-orange-exposure',
          title: 'Agent Orange exposure',
          depends: canVeteranProvideAgentOrangeResponse,
          uiSchema: agentOrangeExposure.uiSchema,
          schema: agentOrangeExposure.schema,
        },
        agentOrangeExposureDates: {
          path: 'military-service/agent-orange-exposure-dates',
          title: 'Agent Orange exposure dates',
          depends: includeAgentOrangeExposureDates,
          uiSchema: agentOrangeExposureDates.uiSchema,
          schema: agentOrangeExposureDates.schema,
        },
        otherToxicExposure: {
          path: 'military-service/other-toxic-exposure',
          title: 'Other toxic exposures',
          depends: includeTeraInformation,
          uiSchema: otherToxicExposure.uiSchema,
          schema: otherToxicExposure.schema,
        },
        otherToxicExposureDetails: {
          path: 'military-service/other-toxins-or-hazards',
          title: 'Other toxin or hazard exposure',
          depends: includeOtherExposureDetails,
          uiSchema: otherToxicExposureDetails.uiSchema,
          schema: otherToxicExposureDetails.schema,
        },
        otherToxicExposureDates: {
          path: 'military-service/other-toxic-exposure-dates',
          title: 'Other toxic exposure dates',
          depends: includeOtherExposureDates,
          uiSchema: otherToxicExposureDates.uiSchema,
          schema: otherToxicExposureDates.schema,
        },
        supportingDocuments: {
          path: 'military-service/upload-supporting-documents',
          title: 'Upload supporting documents',
          depends: teraUploadEnabled,
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
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
          depends: includeHouseholdInformationV1,
          uiSchema: maritalStatus.uiSchema,
          schema: maritalStatus.schema,
        },
        maritalStatusInformation: {
          path: 'household-information/marital-status-information',
          title: 'Marital status',
          initialData: {},
          depends: includeHouseholdInformationV2,
          CustomPage: MaritalStatusPage,
          CustomPageReview: null,
          uiSchema: maritalStatus.uiSchema,
          schema: maritalStatus.schema,
        },
        ...spousalInformationPages,
        spousePersonalInformation: {
          path: 'household-information/spouse-personal-information',
          title: 'Spouse\u2019s personal information',
          initialData: {},
          depends: includeSpousalInformationV1,
          uiSchema: spousePersonalInformation.uiSchema,
          schema: spousePersonalInformation.schema,
        },
        spouseAdditionalInformation: {
          path: 'household-information/spouse-additional-information',
          title: 'Spouse\u2019s additional information',
          initialData: {},
          depends: includeSpousalInformationV1,
          uiSchema: spouseAdditionalInformation.uiSchema,
          schema: spouseAdditionalInformation.schema,
        },
        spouseFinancialSupport: {
          path: 'household-information/spouse-financial-support',
          title: 'Spouse\u2019s financial support',
          depends: spouseDidNotCohabitateWithVeteranV1,
          uiSchema: spouseFinancialSupport.uiSchema,
          schema: spouseFinancialSupport.schema,
        },
        spouseContactInformation: {
          path: 'household-information/spouse-contact-information',
          title: 'Spouse\u2019s address and phone number',
          initialData: {},
          depends: spouseAddressDoesNotMatchVeteransV1,
          uiSchema: spouseContactInformation.uiSchema,
          schema: spouseContactInformation.schema,
        },
        dependentSummary: {
          path: DEPENDENT_PATHS.summary,
          title: 'Your Dependents',
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
        ...FinancialInformationPages,
        veteranAnnualIncomeV1: {
          path: 'household-information/veteran-annual-income',
          title: 'Your annual income',
          initialData: {},
          depends: includeHouseholdInformationWithV1Prefill,
          uiSchema: veteranAnnualIncome.uiSchema,
          schema: veteranAnnualIncome.schema,
        },
        spouseAnnualIncomeV1: {
          path: 'household-information/spouse-annual-income',
          title: 'Spouse\u2019s annual income',
          initialData: {},
          depends: includeSpousalInformationWithV1Prefill,
          uiSchema: spouseAnnualIncome.uiSchema,
          schema: spouseAnnualIncome.schema,
        },
        deductibleExpensesV1: {
          path: 'household-information/deductible-expenses',
          title: 'Deductible expenses',
          initialData: {},
          depends: includeHouseholdInformationWithV1Prefill,
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
  },
};

export default formConfig;
