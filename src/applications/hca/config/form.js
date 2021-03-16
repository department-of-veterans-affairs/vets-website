import { set } from 'lodash/fp';

// platform imports
import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { hasSession } from 'platform/user/profile/utilities';
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
import { prefillTransformer, transform } from '../helpers';
import ConfirmationPage from '../containers/ConfirmationPage';
import { createDependentSchema } from '../definitions/dependent';

// chapter 1 Veteran Information
import birthInformation from './chapters/veteranInformation/birthInformation';
import veteranInformation from './chapters/veteranInformation/personalnformation';
import demographicInformation from './chapters/veteranInformation/demographicInformation';
import veteranAddress from './chapters/veteranInformation/veteranAddress';
import veteranHomeAddress from './chapters/veteranInformation/veteranHomeAddress';
import contactInformation from './chapters/veteranInformation/contactInformation';

// chapter 2 Military Service
import serviceInformation from './chapters/militaryService/serviceInformation';
import additionalInformation from './chapters/militaryService/additionalInformation';
import documentUpload from './chapters/militaryService/documentUpload';

// chapter 3 VA Benefits
import basicInformation from './chapters/vaBenefits/basicInformation';

// chapter 4 Household Information
import financialDisclosure from './chapters/householdInformation/financialDisclosure';
import spouseInformation from './chapters/householdInformation/spouseInformation';
import dependentInformation from './chapters/householdInformation/dependentInformation';
import annualIncome from './chapters/householdInformation/annualIncome';
import deductibleExpenses from './chapters/householdInformation/deductibleExpenses';

// chapter 5 Insurance Information
import medicare from './chapters/insuranceInformation/medicare';
import general from './chapters/insuranceInformation/general';
import vaFacility from './chapters/insuranceInformation/vaFacility';

const dependentSchema = createDependentSchema(fullSchemaHca);

const {
  date,
  fullName,
  monetaryValue,
  phone,
  provider,
  ssn,
} = fullSchemaHca.definitions;

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
    fullName: set('properties.middle.maxLength', 30, fullName),
    ssn: ssn.oneOf[0], // Mmm...not a fan.
    phone,
    dependent: dependentSchema,
    monetaryValue,
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran information',
          initialData: {},
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        birthInformation: {
          path: 'veteran-information/birth-information',
          title: 'Veteran information',
          initialData: {},
          uiSchema: birthInformation.uiSchema,
          schema: birthInformation.schema,
        },
        demographicInformation: {
          path: 'veteran-information/demographic-information',
          title: 'Veteran information',
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
    militaryService: {
      title: 'Military Service',
      pages: {
        serviceInformation: {
          path: 'military-service/service-information',
          title: 'Service periods',
          uiSchema: serviceInformation.uiSchema,
          schema: serviceInformation.schema,
        },
        additionalInformation: {
          path: 'military-service/additional-information',
          title: 'Service history',
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
        documentUpload: {
          title: 'Upload your discharge papers',
          path: 'military-service/documents',
          depends: formData => !formData['view:isUserInMvi'],
          editModeOnReviewPage: true,
          uiSchema: documentUpload.uiSchema,
          schema: documentUpload.schema,
        },
      },
    },
    vaBenefits: {
      title: 'VA Benefits',
      pages: {
        vaBenefits: {
          path: 'va-benefits/basic-information',
          title: 'VA benefits',
          uiSchema: basicInformation.uiSchema,
          schema: basicInformation.schema,
        },
      },
    },
    householdInformation: {
      title: 'Household Information',
      pages: {
        financialDisclosure: {
          path: 'household-information/financial-disclosure',
          title: 'Financial disclosure',
          uiSchema: financialDisclosure.uiSchema,
          schema: financialDisclosure.schema,
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
      title: 'Insurance Information',
      pages: {
        medicare: {
          path: 'insurance-information/medicare',
          title: 'Medicaid or Medicare coverage',
          initialData: {},
          uiSchema: medicare.uiSchema,
          schema: medicare.schema,
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
