import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE as title, SUBTITLE as subTitle } from '../constants';
import manifest from '../manifest.json';
import introduction from '../containers/IntroductionPage';
import confirmation from '../containers/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import getHelp from '../components/Help';

import prefillTransformer from './prefillTransformer';

const blankSchema = { type: 'object', properties: {} }; // eslint-disable-line no-unused-vars

const savedFormMessages = {
  notFound: 'Please start over to reorder health care supplies.',
  noAuth:
    'Please sign in again to continue your application for health care supply reordering.',
};

const saveInProgress = {
  messages: {
    inProgress:
      'Your health care supply reordering application (2346) is in progress.',
    expired:
      'Your saved health care supply reordering application (2346) has expired. If you want to reorder supplies, please start a new application.',
    saved: 'Your health care supply reordering application has been saved.',
  },
};

const customText = {
  // appSavedSuccessfullyMessage: '',
  appType: 'order',
  // continueAppButtonText: '',
  // reviewPageTitle: '',
  // startNewAppButtonText: '',
  // submitButtonText: '',
};

// const formOptions = {
//   noTitle: true,
//   noTopNav: true,
//   noBottomNav: true,
//   fullWidth: true,
// };

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/mdot/supplies`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mhv-supply-reordering-',
  introduction,
  confirmation,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_VA_2346A,
  // formOptions,
  savedFormMessages,
  saveInProgress,
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  title,
  subTitle,
  customText,
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
  getHelp,
  footerContent,
};

export default formConfig;
