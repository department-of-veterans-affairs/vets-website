import { VA_FORM_IDS } from 'platform/forms/constants';

import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import { SUBTITLE, TITLE } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import manifest from '../manifest.json';
import demo from '../pages/demo';
import ratedOrNewNextPagePages from '../pages/ratedOrNewNextPage';
import ratedOrNewRadiosPages from '../pages/ratedOrNewRadios';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'conditions',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  getHelp: GetFormHelp,
  footerContent: FormFooter,
  // dev: {
  //   showNavLinks: true,
  //   collapsibleNavLinks: true,
  // },
  formId: VA_FORM_IDS.FORM_21_526EZ,
  saveInProgress: {
    messages: {
      inProgress:
        'Your disability compensation application (21-526EZ) is in progress.',
      expired:
        'Your saved disability compensation application (21-526EZ) has expired. If you want to apply for disability compensation, start a new application.',
      saved: 'Your disability compensation application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Start over to apply for disability compensation.',
    noAuth:
      'Sign in again to continue your application for disability compensation.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  v3SegmentedProgressBar: true,
  defaultDefinitions: {},
  chapters: {
    conditionsChapter: {
      title: 'Conditions',
      pages: {
        demo,
        ...ratedOrNewNextPagePages,
        ...ratedOrNewRadiosPages,
      },
    },
  },
};

export default formConfig;
