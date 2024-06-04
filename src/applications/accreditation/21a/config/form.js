import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

// import fullSchema from 'vets-json-schema/dist/21A-schema.json';

import manifest from '../manifest.json';

import GetFormHelp from '../components/GetFormHelp';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

import contactInformation from '../pages/contactInformation';
import currentEmployerAddressPhone from '../pages/currentEmployerAddressPhone';
import currentEmployerDates from '../pages/currentEmployerDates';
import currentEmployerInformation from '../pages/currentEmployerInformation';
import employerReview from '../pages/employerReview';
import homeAddress from '../pages/homeAddress';
import militaryHistory from '../pages/militaryHistory';
import militaryServiceExperience from '../pages/militaryServiceExperience';
import personalInformation from '../pages/personalInformation';
import placeOfBirth from '../pages/placeOfBirth';
import previousEmployerInformation from '../pages/previousEmployerInformation';
import workAddress from '../pages/workAddress';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const { fullName, date } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_21A,
  saveInProgress: {
    messages: {
      inProgress:
        'Your application to become a VA accredited attorney or claims agent (21a) is in progress.',
      expired:
        'Your saved application to become a VA accredited attorney or claims agent (21a) has expired. If you want to apply to become a VA accredited attorney or claims agent, please start a new application.',
      saved:
        'Your application to become a VA accredited attorney or claims agent (21a) has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply to become a VA accredited attorney or claims agent.',
    noAuth:
      'Please sign in again to continue your application to become a VA accredited attorney or claims agent.',
  },
  title: 'Apply to become a VA accredited attorney or claims agent',
  subTitle: 'VA Form 21a',
  defaultDefinitions: {
    fullName,
    date,
  },
  chapters: {
    personalInformation: {
      title: 'Personal information',
      pages: {
        personalInformation: {
          path: 'personal-information',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
        placeOfBirth: {
          path: 'place-of-birth',
          uiSchema: placeOfBirth.uiSchema,
          schema: placeOfBirth.schema,
        },
        contactInformation: {
          path: 'contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        homeAddress: {
          path: 'home-address',
          uiSchema: homeAddress.uiSchema,
          schema: homeAddress.schema,
        },
        workAddress: {
          path: 'work-address',
          uiSchema: workAddress.uiSchema,
          schema: workAddress.schema,
        },
        militaryHistory: {
          path: 'military-history',
          uiSchema: militaryHistory.uiSchema,
          schema: militaryHistory.schema,
        },
        militaryServiceExperience: {
          path: 'military-service-experience',
          uiSchema: militaryServiceExperience.uiSchema,
          schema: militaryServiceExperience.schema,
        },
      },
    },
    employmentInformation: {
      title: 'Employment information',
      pages: {
        currentEmployerInformation: {
          path: 'current-employer-information',
          uiSchema: currentEmployerInformation.uiSchema,
          schema: currentEmployerInformation.schema,
        },
        currentEmployerAddressPhone: {
          path: 'current-employer-address-phone',
          uiSchema: currentEmployerAddressPhone.uiSchema,
          schema: currentEmployerAddressPhone.schema,
        },
        currentEmployerDates: {
          path: 'current-employer-dates',
          uiSchema: currentEmployerDates.uiSchema,
          schema: currentEmployerDates.schema,
        },
        employerReview: {
          path: 'employer-review',
          uiSchema: employerReview.uiSchema,
          schema: employerReview.schema,
        },
        previousEmployerInformation: {
          path: 'previous-employer-information',
          uiSchema: previousEmployerInformation.uiSchema,
          schema: previousEmployerInformation.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
