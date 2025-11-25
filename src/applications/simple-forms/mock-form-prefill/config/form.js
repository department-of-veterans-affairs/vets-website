// @ts-check
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import prefillTransformer from './prefill-transformer';

import personalInfo from './personalInfo';
import { contactInfo } from './contactInfo';
// import nameAndDateOfBirth from '../pages/nameAndDateOfBirth'; // <~ can probably delete this file

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-prefill-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/mock-form-prefill',
        label: 'Mock form prefill',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_MOCK_PREFILL,
  saveInProgress: {
    messages: {
      inProgress:
        'Your mock prefill testing application (FORM_MOCK_PREFILL) is in progress.',
      expired:
        'Your saved mock prefill testing application (FORM_MOCK_PREFILL) has expired. If you want to apply for mock prefill testing, please start a new application.',
      saved: 'Your mock prefill testing application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: false,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for mock prefill testing.',
    noAuth:
      'Please sign in again to continue your application for mock prefill testing.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    contactInfo: {
      title: 'Your personal information',
      pages: {
        ...personalInfo,
        ...contactInfo,
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
