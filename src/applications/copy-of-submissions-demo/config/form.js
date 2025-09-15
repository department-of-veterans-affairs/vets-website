import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
// Use the simpler static-demo-2 introduction for the codespace/demo launch page
import IntroductionPage from '../containers/static-demo/StaticDemoApp';
// import IntroductionPage from '../containers/static-demo/IntroductionPage';
import ConfirmationPage from '../containers/static-demo/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';

/** @type {FormConfig} */
/*
// ORIGINAL interactive formConfig (commented out)
import environment from 'platform/utilities/environment';

const originalFormConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // Use the platform environment so local builds will target the mock API on port 3000
  submitUrl: `${environment.API_URL}/v0/526-summary-demo/submit`,
  submit: formData =>
    // POST to the local mock submit endpoint (environment.API_URL -> http://localhost:3000)
    fetch(`${environment.API_URL}/v0/526-summary-demo/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(res => res.json()),
  trackingPrefix: 'copy-of-submissions-demo-',
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
        href: '/copy-of-submissions-demo',
        label: 'Copy of submissions demo',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_21_526EZ_SUMMARY_DEMO,
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
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
  footerContent,
};

*/
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'copy-of-submissions-demo-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/copy-of-submissions-demo/introduction', label: 'Home' },
      {
        href: '/copy-of-submissions-demo/introduction',
        label: 'Disability Benefits',
      },
      {
        href: '/copy-of-submissions-demo/introduction',
        label: 'File for disability compensation',
      },
    ],
  }),
  // Hide the minimal header form title on the confirmation page so the
  // global app title/subtitle (from constants) doesn't appear above the
  // confirmation content when refreshing that route.
  hideFormTitleConfirmation: true,
  formId: VA_FORM_IDS.FORM_21_526EZ_SUMMARY_DEMO,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (21-526EZ-SUMMARY-DEMO) is in progress.',
    //   expired: 'Your saved benefits application (21-526EZ-SUMMARY-DEMO) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
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
