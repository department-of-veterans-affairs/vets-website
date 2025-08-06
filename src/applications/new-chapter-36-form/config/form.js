import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'careers-employment-27-8832-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_27_8832,
  formOptions: {
    useWebComponentForNavigation: true,
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your Personalized Career Planning and Guidance Chapter 36 benefit application is in progress.',
      expired:
        'Your saved Personalized Career Planning and Guidance Chapter 36 benefit application has expired. If you want to apply for PCPG Chapter 36 benefits, start a new application.',
      saved: 'Your PCPG Chapter 36 benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for personalized career planning and guidance.',
    noAuth:
      'Please sign in again to continue your application for personalized career planning and guidance.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
