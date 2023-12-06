// platform imports
import environment from 'platform/utilities/environment';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

// HCA internal app imports
import {
  prefillTransformer,
  transform,
  isShortFormEligible,
  includeSpousalInformation,
} from '../utils/helpers';
import { HIGH_DISABILITY_MINIMUM, SHARED_PATHS } from '../utils/constants';
import migrations from './migrations';
import manifest from '../manifest.json';
import IDPage from '../containers/IDPage';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SubmissionErrorAlert from '../components/FormAlerts/SubmissionErrorAlert';
import { DowntimeWarning } from '../components/FormAlerts';
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

// chapter 2 Military Service
import serviceInformation from './chapters/militaryService/serviceInformation';
import additionalInformation from './chapters/militaryService/additionalInformation';
import documentUpload from './chapters/militaryService/documentUpload';

// chapter 3 VA Benefits
import basicInformation from './chapters/vaBenefits/basicInformation';
import pensionInformation from './chapters/vaBenefits/pensionInformation';
import DisabilityConfirmationPage from '../components/FormPages/DisabilityConfirmation';
import CompensationTypeReviewPage from '../components/FormReview/CompensationTypeReviewPage';

// chapter 4 Household Information - for v1 only -- remove when v2 is fully-adopted
import v1FinancialDisclosure from './chapters/householdInformation/financialDisclosure';
import v1MaritalStatus from './chapters/householdInformation/maritalStatus';
import v1SpouseInformation from './chapters/householdInformation/spouseInformation';
import v1DependentInformation from './chapters/householdInformation/dependentInformation';
import v1AnnualIncome from './chapters/householdInformation/annualIncome';
import v1DeductibleExpenses from './chapters/householdInformation/deductibleExpenses';

// chapter 4 Household Information - for v2 only -- rename imports when v2 is fully-adopted
import v2FinancialDisclosure from './chapters/householdInformationV2/financialDisclosure';
import v2MaritalStatus from './chapters/householdInformationV2/maritalStatus';
import v2SpouseBasicInformation from './chapters/householdInformationV2/spouseBasicInformation';
import v2SpouseContactInformation from './chapters/householdInformationV2/spouseContactInformation';
import v2SpouseAdditionalInformation from './chapters/householdInformationV2/spouseAdditionalInformation';
import v2SpouseFinancialSupport from './chapters/householdInformationV2/spouseFinancialSupport';
import v2DependentSummary from './chapters/householdInformationV2/dependentSummary';
import v2SpouseAnnualIncome from './chapters/householdInformationV2/spouseAnnualIncome';
import v2VeteranAnnualIncome from './chapters/householdInformationV2/veteranAnnualIncome';
import v2DeductibleExpenses from './chapters/householdInformationV2/deductibleExpenses';
import v2FinancialOnboarding from '../components/FormPages/FinancialOnboarding';
import v2FinancialConfirmation from '../components/FormPages/FinancialConfirmation';
import v2FinancialInformation from '../components/FormPages/FinancialInformation';
import v2DependentInformationPage from '../components/FormPages/DependentInformation';
import v2DependentSummaryPage from '../components/FormPages/DependentSummary';
import v2DependentsReviewPage from '../components/FormReview/DependentsReviewPage';

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
    message: DowntimeWarning,
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  additionalRoutes: [
    {
      path: 'id-form',
      component: IDPage,
      pageKey: 'id-form',
      depends: formData => !formData['view:isLoggedIn'],
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
          depends: formData =>
            formData['view:isLoggedIn'] && !formData['view:userDob'],
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
          depends: formData => formData['view:isSigiEnabled'],
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
          depends: formData => !formData['view:doesMailingMatchHomeAddress'],
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
          depends: formData =>
            formData['view:totalDisabilityRating'] < HIGH_DISABILITY_MINIMUM,
          CustomPageReview: CompensationTypeReviewPage,
          uiSchema: basicInformation.uiSchema,
          schema: basicInformation.schema,
        },
        vaPayConfirmation: {
          path: 'va-benefits/confirm-service-pay',
          title: 'Disability confirmation',
          initialData: {},
          depends: formData => formData.vaCompensationType === 'highDisability',
          CustomPage: DisabilityConfirmationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        vaPension: {
          path: 'va-benefits/pension-information',
          title: 'VA pension',
          depends: formData => formData.vaCompensationType === 'none',
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
          depends: formData => !isShortFormEligible(formData),
          uiSchema: serviceInformation.uiSchema,
          schema: serviceInformation.schema,
        },
        additionalInformation: {
          path: 'military-service/additional-information',
          title: 'Service history',
          depends: formData => !isShortFormEligible(formData),
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
        documentUpload: {
          title: 'Upload your discharge papers',
          path: 'military-service/documents',
          depends: formData =>
            !isShortFormEligible(formData) && !formData['view:isUserInMvi'],
          editModeOnReviewPage: true,
          uiSchema: documentUpload.uiSchema,
          schema: documentUpload.schema,
        },
      },
    },
    // NOTE: for household v1 only -- remove when v2 is fully-adopted
    householdInformation: {
      title: 'Household information',
      pages: {
        v1FinancialDisclosure: {
          path: 'household-information/financial-disclosure',
          title: 'Financial disclosure',
          depends: formData =>
            !isShortFormEligible(formData) &&
            !formData['view:isHouseholdV2Enabled'],
          uiSchema: v1FinancialDisclosure.uiSchema,
          schema: v1FinancialDisclosure.schema,
        },
        v1MaritalStatus: {
          path: 'household-information/marital-status',
          title: 'Marital status information',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            !formData['view:isHouseholdV2Enabled'],
          uiSchema: v1MaritalStatus.uiSchema,
          schema: v1MaritalStatus.schema,
        },
        v1SpouseInformation: {
          path: 'household-information/spouse-information',
          title: 'Spouse\u2019s information',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            includeSpousalInformation(formData) &&
            !formData['view:isHouseholdV2Enabled'],
          uiSchema: v1SpouseInformation.uiSchema,
          schema: v1SpouseInformation.schema,
        },
        v1DependentInformation: {
          path: 'household-information/dependent-information',
          title: 'Dependent information',
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData.discloseFinancialInformation &&
            !formData['view:isHouseholdV2Enabled'],
          uiSchema: v1DependentInformation.uiSchema,
          schema: v1DependentInformation.schema,
        },
        v1AnnualIncome: {
          path: 'household-information/annual-income',
          title: 'Annual income',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData.discloseFinancialInformation &&
            !formData['view:isHouseholdV2Enabled'],
          uiSchema: v1AnnualIncome.uiSchema,
          schema: v1AnnualIncome.schema,
        },
        v1DeductibleExpenses: {
          path: 'household-information/deductible-expenses',
          title: 'Deductible expenses',
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData.discloseFinancialInformation &&
            !formData['view:isHouseholdV2Enabled'],
          uiSchema: v1DeductibleExpenses.uiSchema,
          schema: v1DeductibleExpenses.schema,
        },
      },
    },
    // NOTE: for household v2 only -- rename routes when v2 is fully-adopted
    householdInformationV2: {
      title: 'Household financial information',
      pages: {
        v2FinancialOnboarding: {
          path: 'household-information-v2/financial-information-use',
          title: 'Financial information use',
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData['view:isHouseholdV2Enabled'],
          CustomPage: v2FinancialOnboarding,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        v2FinancialDisclosure: {
          path: 'household-information-v2/share-financial-information',
          title: 'Share financial information',
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2FinancialDisclosure.uiSchema,
          schema: v2FinancialDisclosure.schema,
        },
        v2FinancialConfirmation: {
          path: 'household-information-v2/share-financial-information-confirm',
          title: 'Share financial information confirmation',
          depends: formData =>
            !isShortFormEligible(formData) &&
            !formData.discloseFinancialInformation &&
            formData['view:isHouseholdV2Enabled'],
          CustomPage: v2FinancialConfirmation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        v2FinancialInformation: {
          path: 'household-information-v2/financial-information-needed',
          title: 'Financial information needed',
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData.discloseFinancialInformation &&
            formData['view:isHouseholdV2Enabled'],
          CustomPage: v2FinancialInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        v2MaritalStatus: {
          path: 'household-information-v2/marital-status',
          title: 'Marital status',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2MaritalStatus.uiSchema,
          schema: v2MaritalStatus.schema,
        },
        v2SpouseBasicInformation: {
          path: 'household-information-v2/spouse-personal-information',
          title: 'Spouse\u2019s personal information',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            includeSpousalInformation(formData) &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2SpouseBasicInformation.uiSchema,
          schema: v2SpouseBasicInformation.schema,
        },
        v2SpouseAdditionalInformation: {
          path: 'household-information-v2/spouse-additional-information',
          title: 'Spouse\u2019s additional information',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            includeSpousalInformation(formData) &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2SpouseAdditionalInformation.uiSchema,
          schema: v2SpouseAdditionalInformation.schema,
        },
        v2SpouseFinancialSupport: {
          path: 'household-information-v2/spouse-financial-support',
          title: 'Spouse\u2019s financial support',
          depends: formData =>
            !isShortFormEligible(formData) &&
            includeSpousalInformation(formData) &&
            !formData.cohabitedLastYear &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2SpouseFinancialSupport.uiSchema,
          schema: v2SpouseFinancialSupport.schema,
        },
        v2SpouseContactInformation: {
          path: 'household-information-v2/spouse-contact-information',
          title: 'Spouse\u2019s address and phone number',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            includeSpousalInformation(formData) &&
            !formData.sameAddress &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2SpouseContactInformation.uiSchema,
          schema: v2SpouseContactInformation.schema,
        },
        v2DependentSummary: {
          path: DEPENDENT_PATHS.summary,
          title: 'Dependents',
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData.discloseFinancialInformation &&
            formData['view:isHouseholdV2Enabled'],
          CustomPage: v2DependentSummaryPage,
          CustomPageReview: v2DependentsReviewPage,
          uiSchema: v2DependentSummary.uiSchema,
          schema: v2DependentSummary.schema,
        },
        v2DependentInformation: {
          path: DEPENDENT_PATHS.info,
          title: 'Dependent information',
          depends: formData =>
            !isShortFormEligible(formData) &&
            !formData['view:skipDependentInfo'] &&
            formData.discloseFinancialInformation &&
            formData['view:isHouseholdV2Enabled'],
          CustomPage: v2DependentInformationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        v2VeteranAnnualIncome: {
          path: 'household-information-v2/veteran-annual-income',
          title: 'Your annual income',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData.discloseFinancialInformation &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2VeteranAnnualIncome.uiSchema,
          schema: v2VeteranAnnualIncome.schema,
        },
        v2SpouseAnnualIncome: {
          path: 'household-information-v2/spouse-annual-income',
          title: 'Spouse\u2019s annual income',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            includeSpousalInformation(formData) &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2SpouseAnnualIncome.uiSchema,
          schema: v2SpouseAnnualIncome.schema,
        },
        v2DeductibleExpenses: {
          path: 'household-information-v2/deductible-expenses',
          title: 'Deductible expenses',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) &&
            formData.discloseFinancialInformation &&
            formData['view:isHouseholdV2Enabled'],
          uiSchema: v2DeductibleExpenses.uiSchema,
          schema: v2DeductibleExpenses.schema,
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
          depends: formData => !isShortFormEligible(formData),
          uiSchema: medicare.uiSchema,
          schema: medicare.schema,
        },
        medicarePartAEffectiveDate: {
          path: 'insurance-information/medicare-part-a-effective-date',
          title: 'Medicare Part A effective date',
          initialData: {},
          depends: formData =>
            !isShortFormEligible(formData) && formData.isEnrolledMedicarePartA,
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
          depends: formData => !formData['view:isFacilitiesApiEnabled'],
          uiSchema: vaFacilityJsonPage.uiSchema,
          schema: vaFacilityJsonPage.schema,
        },
        vaFacilityLighthouse: {
          path: 'insurance-information/va-facility-api',
          title: 'VA Facility',
          initialData: {
            isEssentialAcaCoverage: false,
          },
          depends: formData => formData['view:isFacilitiesApiEnabled'],
          uiSchema: vaFacilityApiPage.uiSchema,
          schema: vaFacilityApiPage.schema,
        },
      },
    },
  },
};

export default formConfig;
