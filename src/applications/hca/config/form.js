import { set } from 'lodash/fp';

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

// chapter 5
import medicare from './chapters/insuranceInformation/medicare';
import general from './chapters/insuranceInformation/general';
import vaFacility from './chapters/insuranceInformation/vaFacility';

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { hasSession } from 'platform/user/profile/utilities';
import environment from 'platform/utilities/environment';

import preSubmitInfo from 'platform/forms/preSubmitInfo';

import DowntimeMessage from '../components/DowntimeMessage';
import ErrorText from '../components/ErrorText';
import FormFooter from '../components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import IDPage from '../containers/IDPage';

import { prefillTransformer, transform } from '../helpers';

import migrations from './migrations';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ErrorMessage from '../components/ErrorMessage';

import { createDependentSchema } from '../definitions/dependent';

import manifest from '../manifest.json';

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
        medicare,
        general,
        vaFacility,
      },
    },
  },
};

export default formConfig;
