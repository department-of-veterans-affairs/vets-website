import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
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
  trackingPrefix: '10-10d-extended-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/ivc-champva',
        label: 'Ivc champva',
      },
      {
        href: '/ivc-champva/10-10d-extended',
        label: '10 10d extended',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_10_10D_EXTENDED,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your CHAMPVA application (includes 10-7959c) application (10-10D-EXTENDED) is in progress.',
    //   expired: 'Your saved CHAMPVA application (includes 10-7959c) application (10-10D-EXTENDED) has expired. If you want to apply for CHAMPVA application (includes 10-7959c), please start a new application.',
    //   saved: 'Your CHAMPVA application (includes 10-7959c) application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for CHAMPVA application (includes 10-7959c).',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA application (includes 10-7959c).',
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
