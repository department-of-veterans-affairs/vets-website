import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  TITLE,
  SUBTITLE,
  YOUR_INFORMATION_PAGES_CONSTANTS,
} from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import personalInformationPage from '../pages/personalInformation';
import educationPage from '../pages/education';
import getHelp from '../components/GetFormHelp';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // TODO: Figure out actual API and structure, create submit function, create any transformers, vets-json schema
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'new-careers-employment-28-1900-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  stepLabels: 'Your Information;Contact Information;Review',
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_28_1900,
  // TODO: Set up save in progress/prefill
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your VR&amp;E Chapter 31 benefits application application (28-1900) is in progress.',
    //   expired: 'Your saved VR&amp;E Chapter 31 benefits application application (28-1900) has expired. If you want to apply for VR&amp;E Chapter 31 benefits application, please start a new application.',
    //   saved: 'Your VR&amp;E Chapter 31 benefits application application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for VR&amp;E Chapter 31 benefits application.',
    noAuth:
      'Please sign in again to continue your application for VR&amp;E Chapter 31 benefits application.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    yourInformationChapter: {
      title: 'Your information',
      pages: {
        personalInformationPage: {
          path: 'personal-information', // Do we know what we want this to be?
          title: YOUR_INFORMATION_PAGES_CONSTANTS.personalInformationPageTitle,
          uiSchema: personalInformationPage.uiSchema,
          schema: personalInformationPage.schema,
        },
        educationPage: {
          path: 'education', // Do we know what we want this to be?
          title: YOUR_INFORMATION_PAGES_CONSTANTS.educationPageTitle,
          uiSchema: educationPage.uiSchema,
          schema: educationPage.schema,
        },
      },
    },
  },
  getHelp,
  footerContent,
};

export default formConfig;
