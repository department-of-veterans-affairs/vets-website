import { VA_FORM_IDS } from 'platform/forms/constants';

import FormFooter from '../components/FormFooter';
import { SUBTITLE, TITLE } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import manifest from '../manifest.json';
import chooseDemo from '../pages/chooseDemo';
import conditionByConditionPages from '../pages/conditionByConditionPages';
import conditionsFirstPages from '../pages/conditionsFirstPages';
import followUpCause from '../pages/followUpCause';
import followUpCauseDescription from '../pages/followUpCauseDescription';
import followUpDate from '../pages/followUpDate';
import followUpIntro from '../pages/followUpIntro';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'new-conditions',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
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
    newConditionsChapter: {
      title: 'Conditions',
      pages: {
        chooseDemo,
        ...conditionByConditionPages,
        ...conditionsFirstPages,
        followUpIntro,
        followUpDate,
        followUpCause,
        followUpCauseDescription,
      },
    },
  },
};

export default formConfig;
