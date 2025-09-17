import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { authorizedOfficial } from '../pages';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-0839-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_0839,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-0839) is in progress.',
    //   expired: 'Your saved education benefits application (22-0839) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  customText: {
    appType: 'form',
  },
  chapters: {
    personalInformationChapter: {
      title: 'Personal details of authorized official',
      pages: {
        authorizedOfficial: {
          path: 'authorized-official',
          title: 'Authorized Official',
          uiSchema: authorizedOfficial.uiSchema,
          schema: authorizedOfficial.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
