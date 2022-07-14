import set from 'platform/utilities/data/set';

// platform imports
import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

// HCA internal app imports
import migrations from './migrations';
import manifest from '../manifest.json';
import IDPage from '../containers/IDPage';
import ErrorText from '../components/ErrorText';
import FormFooter from '../components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import ErrorMessage from '../components/ErrorMessage';
import DowntimeMessage from '../components/DowntimeMessage';
import IntroductionPage from '../containers/IntroductionPage';
import { prefillTransformer, transform, HIGH_DISABILITY } from '../helpers';
import ConfirmationPage from '../containers/ConfirmationPage';
import { createDependentSchema } from '../definitions/dependent';

// chapter 1 Veteran Information
import PersonalAuthenticatedInformation from '../components/PersonalAuthenticatedInformation';
import personalInformationSsn from './chapters/veteranInformation/personalInformationSsn';
import personalInformationDOB from './chapters/veteranInformation/personalInformationDob';
import birthInformation from './chapters/veteranInformation/birthInformation';
import maidenNameInformation from './chapters/veteranInformation/maidenNameInformation';
import americanIndian from './chapters/veteranInformation/americanIndian';
import birthSex from './chapters/veteranInformation/birthSex';
import veteranInformation from './chapters/veteranInformation/personalnformation';
import demographicInformation from './chapters/veteranInformation/demographicInformation';
import maritalStatus from './chapters/veteranInformation/maritalStatus';
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

// chapter 4 Household Information
import financialDisclosure from './chapters/householdInformation/financialDisclosure';
import spouseInformation from './chapters/householdInformation/spouseInformation';
import dependentInformation from './chapters/householdInformation/dependentInformation';
import annualIncome from './chapters/householdInformation/annualIncome';
import deductibleExpenses from './chapters/householdInformation/deductibleExpenses';

// chapter 5 Insurance Information
import medicaid from './chapters/insuranceInformation/medicaid';
import medicare from './chapters/insuranceInformation/medicare';
import medicarePartAEffectiveDate from './chapters/insuranceInformation/medicarePartAEffectiveDate';
import vaFacility from './chapters/insuranceInformation/vaFacility';
import general from './chapters/insuranceInformation/general';
import ServiceConnectedPayConfirmation from '../components/ServiceConnectedPayConfirmation';
import CompensationTypeReviewPage from '../components/CompensationTypeReviewPage';

const dependentSchema = createDependentSchema(fullSchemaHca);

const {
  date,
  fullName,
  monetaryValue,
  phone,
  provider,
  ssn,
} = fullSchemaHca.definitions;

// For which page should be shown on short form
// based on user disability rating >= 50 or user self directed compensation type = high
const notHighDisability = formData =>
  !formData['view:hcaShortFormEnabled'] ||
  (!formData['view:totalDisabilityRating'] ||
    formData['view:totalDisabilityRating'] < HIGH_DISABILITY);

const notHighDisabilityNotSelfDisclosure = formData =>
  !formData['view:hcaShortFormEnabled'] ||
  (formData.vaCompensationType !== 'highDisability' &&
    (!formData['view:totalDisabilityRating'] ||
      formData['view:totalDisabilityRating'] < HIGH_DISABILITY));

const notHighDisabilityAndNotInMvi = formData =>
  (!formData['view:hcaShortFormEnabled'] && !formData['view:isUserInMvi']) ||
  (formData['view:hcaShortFormEnabled'] &&
    formData.vaCompensationType !== 'highDisability' &&
    !formData['view:isUserInMvi']);

const isHighDisability = formData =>
  formData['view:hcaShortFormEnabled'] &&
  formData.vaCompensationType === 'highDisability';

const notHighDisabilityEnrolledMedicarePartA = formData =>
  (!formData['view:hcaShortFormEnabled'] && formData.isEnrolledMedicarePartA) ||
  (formData['view:hcaShortFormEnabled'] &&
    formData.vaCompensationType !== 'highDisability' &&
    formData.isEnrolledMedicarePartA);

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
      depends: formData => !formData['view:isLoggedIn'],
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
    fullName: set('properties.middle.maxLength', 30, fullName),
    ssn: ssn.oneOf[0], // Mmm...not a fan.
    phone,
    dependent: dependentSchema,
    monetaryValue,
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        veteranProfileInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran information',
          CustomPage: PersonalAuthenticatedInformation,
          CustomPageReview: null,
          initialData: {},
          depends: formData => formData['view:isLoggedIn'],
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
        veteranInformation: {
          path: 'veteran-information/profile-information',
          title: 'Veteran name',
          initialData: {},
          depends: formData => !formData['view:isLoggedIn'],
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        ssnInformation: {
          path: 'veteran-information/profile-information-ssn',
          title: 'Social Security number',
          initialData: {},
          depends: formData => !formData['view:isLoggedIn'],
          uiSchema: personalInformationSsn.uiSchema,
          schema: personalInformationSsn.schema,
        },
        dobInformation: {
          path: 'veteran-information/profile-information-dob',
          title: 'Date of birth',
          initialData: {},
          depends: formData =>
            !formData['view:isLoggedIn'] || !formData['view:userDob'],
          uiSchema: personalInformationDOB.uiSchema,
          schema: personalInformationDOB.schema,
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
          title: "Mother's maiden name",
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
          depends: formData => formData['view:caregiverSIGIEnabled'],
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
        americanIndian: {
          path: 'veteran-information/american-indian',
          title: 'Recognition as an American Indian or Alaska Native',
          initialData: {},
          depends: formData => formData['view:hcaAmericanIndianEnabled'],
          uiSchema: americanIndian.uiSchema,
          schema: americanIndian.schema,
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
          CustomPageReview: CompensationTypeReviewPage,
          depends: notHighDisability,
          uiSchema: basicInformation.uiSchema,
          schema: basicInformation.schema,
        },
        vaPayConfirmation: {
          path: 'va-benefits/confirm-service-pay',
          title: 'Disability Confirmation',
          CustomPage: ServiceConnectedPayConfirmation,
          CustomPageReview: null,
          initialData: {},
          depends: isHighDisability,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
        vaPension: {
          path: 'va-benefits/pension-information',
          title: 'VA pension',
          uiSchema: pensionInformation.uiSchema,
          schema: pensionInformation.schema,
          depends: ({ vaCompensationType }) => vaCompensationType === 'none',
        },
      },
    },
    militaryService: {
      title: 'Military service',
      pages: {
        serviceInformation: {
          path: 'military-service/service-information',
          title: 'Service periods',
          depends: notHighDisabilityNotSelfDisclosure,
          uiSchema: serviceInformation.uiSchema,
          schema: serviceInformation.schema,
        },
        additionalInformation: {
          path: 'military-service/additional-information',
          title: 'Service history',
          depends: notHighDisabilityNotSelfDisclosure,
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
        documentUpload: {
          title: 'Upload your discharge papers',
          path: 'military-service/documents',
          depends: notHighDisabilityAndNotInMvi,
          editModeOnReviewPage: true,
          uiSchema: documentUpload.uiSchema,
          schema: documentUpload.schema,
        },
      },
    },
    householdInformation: {
      title: 'Household information',
      pages: {
        financialDisclosure: {
          path: 'household-information/financial-disclosure',
          title: 'Financial disclosure',
          depends: notHighDisabilityNotSelfDisclosure,
          uiSchema: financialDisclosure.uiSchema,
          schema: financialDisclosure.schema,
        },
        maritalStatus: {
          path: 'household-information/marital-status',
          title: 'Marital status information',
          depends: notHighDisabilityNotSelfDisclosure,
          initialData: {},
          uiSchema: maritalStatus.uiSchema,
          schema: maritalStatus.schema,
        },
        spouseInformation: {
          path: 'household-information/spouse-information',
          title: 'Spouse\u2019s information',
          initialData: {},
          depends: formData =>
            formData.discloseFinancialInformation &&
            formData.maritalStatus &&
            (formData.maritalStatus.toLowerCase() === 'married' ||
              formData.maritalStatus.toLowerCase() === 'separated'),
          uiSchema: spouseInformation.uiSchema,
          schema: spouseInformation.schema,
        },
        dependentInformation: {
          path: 'household-information/dependent-information',
          title: 'Dependent information',
          depends: data => data.discloseFinancialInformation,
          uiSchema: dependentInformation.uiSchema,
          schema: dependentInformation.schema,
        },
        annualIncome: {
          path: 'household-information/annual-income',
          title: 'Annual income',
          initialData: {},
          depends: data => data.discloseFinancialInformation,
          uiSchema: annualIncome.uiSchema,
          schema: annualIncome.schema,
        },
        deductibleExpenses: {
          path: 'household-information/deductible-expenses',
          title: 'Deductible expenses',
          depends: data => data.discloseFinancialInformation,
          uiSchema: deductibleExpenses.uiSchema,
          schema: deductibleExpenses.schema,
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
          depends: notHighDisabilityNotSelfDisclosure,
          initialData: {},
          uiSchema: medicare.uiSchema,
          schema: medicare.schema,
        },
        medicarePartAEffectiveDate: {
          path: 'insurance-information/medicare-part-a-effective-date',
          title: 'Medicare Part A effective date',
          initialData: {},
          depends: notHighDisabilityEnrolledMedicarePartA,
          uiSchema: medicarePartAEffectiveDate.uiSchema,
          schema: medicarePartAEffectiveDate.schema,
        },
        general: {
          path: 'insurance-information/general',
          title: 'Other coverage',
          uiSchema: general.uiSchema,
          schema: general.schema,
        },
        vaFacility: {
          path: 'insurance-information/va-facility',
          title: 'VA Facility',
          initialData: {
            isEssentialAcaCoverage: false,
          },
          uiSchema: vaFacility.uiSchema,
          schema: vaFacility.schema,
        },
      },
    },
  },
};

export default formConfig;
