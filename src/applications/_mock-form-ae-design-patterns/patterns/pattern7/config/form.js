import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
// TITLE and SUBTITLE removed since we're hiding the form title
// Use the simpler static-demo-2 introduction for the codespace/demo launch page
// import { TITLE, SUBTITLE } from '../constants';
import IntroductionPage from '../StaticDemoApp';
import ConfirmationPage from '../components/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/7/copy-of-submission/',
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
      { href: '/introduction', label: 'Home' },
      { href: 'introduction', label: 'Disability Benefits' },
      { href: '/introduction', label: 'File for disability compensation' },
    ],
  }),
  // Override the progress bar configuration to disable it
  v3SegmentedProgressBar: false,
  hideFormTitle: true,
  hideFormTitleConfirmation: true,
  formId: VA_FORM_IDS.FORM_21_526EZ_SUMMARY_DEMO,
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  // Remove title and subtitle to hide them completely
  // title: TITLE,
  // subTitle: SUBTITLE,
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

export default formConfig;
