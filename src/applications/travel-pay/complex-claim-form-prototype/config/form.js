import footerContent from 'platform/forms/components/FormFooter';
import {
  VA_FORM_IDS,
  VA_FORM_IDS_IN_PROGRESS_FORMS_API,
} from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';

const claimId = window.location.pathname
  .split('/')
  .find(segment => /^[0-9a-fA-F-]{36}$/.test(segment));

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'cc-prototype',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_CC,
  saveInProgress: {
    messages: {
      inProgress: 'Your travel pay benefits application is in progress.',
      expired:
        'Your saved travel pay benefits application has expired. If you want to apply for travel pay benefits, please start a new application.',
      saved: 'Your travel pay benefits application has been saved.',
    },
    /**
     * @param {{formId: string}} params
     */
    apiUrl: ({ formId }) =>
      `${
        VA_FORM_IDS_IN_PROGRESS_FORMS_API[formId]
      }${claimId}/in_progress_forms`,
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for travel pay benefits.',
    noAuth:
      'Please sign in again to continue your application for travel pay benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: `claims/${claimId}/name-and-date-of-birth`,
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
