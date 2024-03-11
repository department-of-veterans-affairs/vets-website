// platform imports
import environment from 'platform/utilities/environment';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

// HCA internal app imports
import { prefillTransformer, transform } from '../utils/helpers';
import {
  isLoggedOut,
  isSigiEnabled,
  isMissingVeteranDob,
  hasDifferentHomeAddress,
  hasLowDisabilityRating,
  hasNoCompensation,
  hasHighCompensation,
  notShortFormEligible,
  dischargePapersRequired,
  teraInformationEnabled,
  includeTeraInformation,
  includeGulfWarServiceDates,
  includeOtherExposureDates,
  includeOtherExposureDetails,
  showFinancialConfirmation,
  includeHouseholdInformation,
  includeSpousalInformation,
  spouseDidNotCohabitateWithVeteran,
  spouseAddressDoesNotMatchVeterans,
  includeDependentInformation,
  collectMedicareInformation,
  useJsonFacilityList,
  useLighthouseFacilityList,
} from '../utils/helpers/form-config';
import { SHARED_PATHS } from '../utils/constants';
import migrations from './migrations';
import manifest from '../manifest.json';
import IdentityPage from '../containers/IdentityPage';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SubmissionErrorAlert from '../components/FormAlerts/SubmissionErrorAlert';
import DowntimeWarning from '../components/FormAlerts/DowntimeWarning';
import PreSubmitNotice from '../components/PreSubmitNotice';
import FormFooter from '../components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';

// chapter 1 Veteran Information
import VeteranInformation from '../components/FormPages/VeteranInformation';
import veteranDateOfBirth from './chapters/veteranInformation/veteranDateOfBirth';
import birthInformation from './chapters/veteranInformation/birthInformation';
import maidenNameInformation from './chapters/veteranInformation/maidenNameInformation';
import birthSex from './chapters/veteranInformation/birthSex';
import demographicInformation from './chapters/veteranInformation/demographicInformation';
import veteranAddress from './chapters/veteranInformation/veteranAddress';
import veteranGender from './chapters/veteranInformation/veteranGender';
import veteranHomeAddress from './chapters/veteranInformation/veteranHomeAddress';
import contactInformation from './chapters/veteranInformation/contactInformation';

// chapter 2 VA Benefits
import basicInformation from './chapters/vaBenefits/basicInformation';
import pensionInformation from './chapters/vaBenefits/pensionInformation';
import DisabilityConfirmationPage from '../components/FormPages/DisabilityConfirmation';
import CompensationTypeReviewPage from '../components/FormReview/CompensationTypeReviewPage';

// chapter 3 Military Service
import serviceInformation from './chapters/militaryService/serviceInformation';
import additionalInformation from './chapters/militaryService/additionalInformation';
import toxicExposure from './chapters/militaryService/toxicExposure';
import radiationCleanup from './chapters/militaryService/radiationCleanup';
import gulfWarService from './chapters/militaryService/gulfWarService';
import gulfWarServiceDates from './chapters/militaryService/gulfWarServiceDates';
import combatOperationService from './chapters/militaryService/combatOperationService';
import agentOrangeExposure from './chapters/militaryService/agentOrangeExposure';
import otherToxicExposure from './chapters/militaryService/otherToxicExposure';
import otherToxicExposureDetails from './chapters/militaryService/otherToxicExposureDetails';
import otherToxicExposureDates from './chapters/militaryService/otherToxicExposureDates';
import documentUpload from './chapters/militaryService/documentUpload';

// chapter 4 Household Information
import FinancialDisclosure from './chapters/householdInformation/financialDisclosure';
import MaritalStatus from './chapters/householdInformation/maritalStatus';
import SpouseBasicInformation from './chapters/householdInformation/spouseBasicInformation';
import SpouseContactInformation from './chapters/householdInformation/spouseContactInformation';
import SpouseAdditionalInformation from './chapters/householdInformation/spouseAdditionalInformation';
import SpouseFinancialSupport from './chapters/householdInformation/spouseFinancialSupport';
import DependentSummary from './chapters/householdInformation/dependentSummary';
import SpouseAnnualIncome from './chapters/householdInformation/spouseAnnualIncome';
import VeteranAnnualIncome from './chapters/householdInformation/veteranAnnualIncome';
import DeductibleExpenses from './chapters/householdInformation/deductibleExpenses';
import FinancialOnboarding from '../components/FormPages/FinancialOnboarding';
import FinancialConfirmation from '../components/FormPages/FinancialConfirmation';
import FinancialInformation from '../components/FormPages/FinancialInformation';
import DependentInformationPage from '../components/FormPages/DependentInformation';
import DependentSummaryPage from '../components/FormPages/DependentSummary';
import DependentsReviewPage from '../components/FormReview/DependentsReviewPage';

// chapter 5 Insurance Information
import medicaid from './chapters/insuranceInformation/medicaid';
import medicare from './chapters/insuranceInformation/medicare';
import medicarePartAEffectiveDate from './chapters/insuranceInformation/medicarePartAEffectiveDate';
import general from './chapters/insuranceInformation/general';
import vaFacilityJsonPage from './chapters/insuranceInformation/vaFacility_json';
import vaFacilityApiPage from './chapters/insuranceInformation/vaFacility_api';

// declare shared paths for custom form page navigation
const { dependents: DEPENDENT_PATHS } = SHARED_PATHS;

// declare schema definitions
const { date } = fullSchemaHca.definitions;

/**
 * NOTE: Prefill message data values can be found in
 * `vets-api/config/form_profile_mappings/1010ez.yml`
 */
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
  version: migrations.length,
  migrations,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for health care.',
    noAuth: 'Please sign in again to resume your application for health care.',
  },
  downtime: {
    dependencies: [externalServices.es],
    message: DowntimeWarning,
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  additionalRoutes: [
    {
      path: 'id-form',
      component: IdentityPage,
      pageKey: 'id-form',
      depends: isLoggedOut,
    },
  ],
  confirmation: ConfirmationPage,
  submissionError: SubmissionErrorAlert,
  title: 'Apply for VA health care',
  subTitle: 'Form 10-10EZ',
  preSubmitInfo: {
    required: true,
    field: 'privacyAgreementAccepted',
    CustomComponent: PreSubmitNotice,
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: { date },
  chapters: {
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        veteranProfileInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran\u2019s personal information',
          CustomPage: VeteranInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        dobInformation: {
          path: 'veteran-information/profile-information-dob',
          title: 'Date of birth',
          initialData: {},
          depends: isMissingVeteranDob,
          uiSchema: veteranDateOfBirth.uiSchema,
          schema: veteranDateOfBirth.schema,
        },
        birthInformation: {
          path: 'veteran-information/birth-information',
          title: 'Place of birth',
          initialData: {},
          uiSchema: birthInformation.uiSchema,
          schema: birthInformation.schema,
        },
        maidenNameInformation: {
          path: 'veteran-information/maiden-name-information',
          title: 'Mother\u2019s maiden name',
          initialData: {},
          uiSchema: maidenNameInformation.uiSchema,
          schema: maidenNameInformation.schema,
        },
        birthSex: {
          path: 'veteran-information/birth-sex',
          title: 'Sex assigned at birth',
          initialData: {},
          uiSchema: birthSex.uiSchema,
          schema: birthSex.schema,
        },
        veteranGender: {
          path: 'veteran-information/veteran-gender',
          title: 'Gender',
          initialData: {},
          depends: isSigiEnabled,
          uiSchema: veteranGender.uiSchema,
          schema: veteranGender.schema,
        },
        demographicInformation: {
          path: 'veteran-information/demographic-information',
          title: 'What is your race, ethnicity, or origin?',
          initialData: {
            'view:demographicCategories': {
              isSpanishHispanicLatino: false,
            },
          },
          uiSchema: demographicInformation.uiSchema,
          schema: demographicInformation.schema,
        },
        veteranAddress: {
          path: 'veteran-information/veteran-address',
          title: 'Mailing address',
          initialData: {},
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
        veteranHomeAddress: {
          path: 'veteran-information/veteran-home-address',
          title: 'Home address',
          initialData: {},
          depends: hasDifferentHomeAddress,
          uiSchema: veteranHomeAddress.uiSchema,
          schema: veteranHomeAddress.schema,
        },
        contactInformation: {
          path: 'veteran-information/contact-information',
          title: 'Contact information',
          initialData: {},
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },
    vaBenefits: {
      title: 'VA benefits',
      pages: {
        vaBenefits: {
          path: 'va-benefits/basic-information',
          title: 'VA benefits',
          depends: hasLowDisabilityRating,
          CustomPageReview: CompensationTypeReviewPage,
          uiSchema: basicInformation.uiSchema,
          schema: basicInformation.schema,
        },
        vaPayConfirmation: {
          path: 'va-benefits/confirm-service-pay',
          title: 'Disability confirmation',
          initialData: {},
          depends: hasHighCompensation,
          CustomPage: DisabilityConfirmationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        vaPension: {
          path: 'va-benefits/pension-information',
          title: 'VA pension',
          depends: hasNoCompensation,
          uiSchema: pensionInformation.uiSchema,
          schema: pensionInformation.schema,
        },
      },
    },
    militaryService: {
      title: 'Military service',
      pages: {
        serviceInformation: {
          path: 'military-service/service-information',
          title: 'Service periods',
          depends: notShortFormEligible,
          uiSchema: serviceInformation.uiSchema,
          schema: serviceInformation.schema,
        },
        additionalInformation: {
          path: 'military-service/additional-information',
          title: 'Service history',
          depends: notShortFormEligible,
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
        toxicExposure: {
          path: 'military-service/toxic-exposure',
          title: 'Toxic exposure',
          depends: teraInformationEnabled,
          uiSchema: toxicExposure.uiSchema,
          schema: toxicExposure.schema,
        },
        radiationCleanup: {
          path: 'military-service/radiation-cleanup-efforts',
          title: 'Radiation cleanup or response efforts',
          depends: includeTeraInformation,
          uiSchema: radiationCleanup.uiSchema,
          schema: radiationCleanup.schema,
        },
        gulfWarService: {
          path: 'military-service/gulf-war-service',
          title: 'Gulf War service locations',
          depends: includeTeraInformation,
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
        combatOperationService: {
          path: 'military-service/operation-support',
          title: 'Operations',
          depends: includeTeraInformation,
          uiSchema: combatOperationService.uiSchema,
          schema: combatOperationService.schema,
        },
        agentOrangeExposure: {
          path: 'military-service/agent-orange-exposure',
          title: 'Agent Orange exposure',
          depends: includeTeraInformation,
          uiSchema: agentOrangeExposure.uiSchema,
          schema: agentOrangeExposure.schema,
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
        documentUpload: {
          title: 'Upload your discharge papers',
          path: 'military-service/documents',
          depends: dischargePapersRequired,
          editModeOnReviewPage: true,
          uiSchema: documentUpload.uiSchema,
          schema: documentUpload.schema,
        },
      },
    },
    householdInformation: {
      title: 'Household financial information',
      pages: {
        FinancialOnboarding: {
          path: 'household-information/financial-information-use',
          title: 'Financial information use',
          depends: notShortFormEligible,
          CustomPage: FinancialOnboarding,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        FinancialDisclosure: {
          path: 'household-information/share-financial-information',
          title: 'Share financial information',
          depends: notShortFormEligible,
          uiSchema: FinancialDisclosure.uiSchema,
          schema: FinancialDisclosure.schema,
        },
        FinancialConfirmation: {
          path: 'household-information/share-financial-information-confirm',
          title: 'Share financial information confirmation',
          depends: showFinancialConfirmation,
          CustomPage: FinancialConfirmation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        FinancialInformation: {
          path: 'household-information/financial-information-needed',
          title: 'Financial information needed',
          depends: includeHouseholdInformation,
          CustomPage: FinancialInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        MaritalStatus: {
          path: 'household-information/marital-status',
          title: 'Marital status',
          initialData: {},
          depends: notShortFormEligible,
          uiSchema: MaritalStatus.uiSchema,
          schema: MaritalStatus.schema,
        },
        SpouseBasicInformation: {
          path: 'household-information/spouse-personal-information',
          title: 'Spouse\u2019s personal information',
          initialData: {},
          depends: includeSpousalInformation,
          uiSchema: SpouseBasicInformation.uiSchema,
          schema: SpouseBasicInformation.schema,
        },
        SpouseAdditionalInformation: {
          path: 'household-information/spouse-additional-information',
          title: 'Spouse\u2019s additional information',
          initialData: {},
          depends: includeSpousalInformation,
          uiSchema: SpouseAdditionalInformation.uiSchema,
          schema: SpouseAdditionalInformation.schema,
        },
        SpouseFinancialSupport: {
          path: 'household-information/spouse-financial-support',
          title: 'Spouse\u2019s financial support',
          depends: spouseDidNotCohabitateWithVeteran,
          uiSchema: SpouseFinancialSupport.uiSchema,
          schema: SpouseFinancialSupport.schema,
        },
        SpouseContactInformation: {
          path: 'household-information/spouse-contact-information',
          title: 'Spouse\u2019s address and phone number',
          initialData: {},
          depends: spouseAddressDoesNotMatchVeterans,
          uiSchema: SpouseContactInformation.uiSchema,
          schema: SpouseContactInformation.schema,
        },
        DependentSummary: {
          path: DEPENDENT_PATHS.summary,
          title: 'Dependents',
          depends: includeHouseholdInformation,
          CustomPage: DependentSummaryPage,
          CustomPageReview: DependentsReviewPage,
          uiSchema: DependentSummary.uiSchema,
          schema: DependentSummary.schema,
        },
        DependentInformation: {
          path: DEPENDENT_PATHS.info,
          title: 'Dependent information',
          depends: includeDependentInformation,
          CustomPage: DependentInformationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        VeteranAnnualIncome: {
          path: 'household-information/veteran-annual-income',
          title: 'Your annual income',
          initialData: {},
          depends: includeHouseholdInformation,
          uiSchema: VeteranAnnualIncome.uiSchema,
          schema: VeteranAnnualIncome.schema,
        },
        SpouseAnnualIncome: {
          path: 'household-information/spouse-annual-income',
          title: 'Spouse\u2019s annual income',
          initialData: {},
          depends: includeSpousalInformation,
          uiSchema: SpouseAnnualIncome.uiSchema,
          schema: SpouseAnnualIncome.schema,
        },
        DeductibleExpenses: {
          path: 'household-information/deductible-expenses',
          title: 'Deductible expenses',
          initialData: {},
          depends: includeHouseholdInformation,
          uiSchema: DeductibleExpenses.uiSchema,
          schema: DeductibleExpenses.schema,
        },
      },
    },
    insuranceInformation: {
      title: 'Insurance information',
      pages: {
        medicaid: {
          path: 'insurance-information/medicaid',
          title: 'Medicaid coverage',
          initialData: {},
          uiSchema: medicaid.uiSchema,
          schema: medicaid.schema,
        },
        medicare: {
          path: 'insurance-information/medicare',
          title: 'Medicare coverage',
          initialData: {},
          depends: notShortFormEligible,
          uiSchema: medicare.uiSchema,
          schema: medicare.schema,
        },
        medicarePartAEffectiveDate: {
          path: 'insurance-information/medicare-part-a-effective-date',
          title: 'Medicare Part A effective date',
          initialData: {},
          depends: collectMedicareInformation,
          uiSchema: medicarePartAEffectiveDate.uiSchema,
          schema: medicarePartAEffectiveDate.schema,
        },
        general: {
          path: 'insurance-information/general',
          title: 'Other coverage',
          uiSchema: general.uiSchema,
          schema: general.schema,
        },
        vaFacilityJson: {
          path: 'insurance-information/va-facility-json',
          title: 'VA Facility',
          initialData: {
            isEssentialAcaCoverage: false,
          },
          depends: useJsonFacilityList,
          uiSchema: vaFacilityJsonPage.uiSchema,
          schema: vaFacilityJsonPage.schema,
        },
        vaFacilityLighthouse: {
          path: 'insurance-information/va-facility-api',
          title: 'VA Facility',
          initialData: {
            isEssentialAcaCoverage: false,
          },
          depends: useLighthouseFacilityList,
          uiSchema: vaFacilityApiPage.uiSchema,
          schema: vaFacilityApiPage.schema,
        },
      },
    },
  },
};

export default formConfig;
