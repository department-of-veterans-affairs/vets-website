import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE as title, SUBTITLE as subTitle } from '../constants';
import manifest from '../manifest.json';

import contactInformation from '../pages/contactInformation';
import selectSupplies from '../pages/selectSupplies';

import EditAddress from '../components/EditAddress';
import EditEmail from '../components/EditEmail';
import getHelp from '../components/Help';

import introduction from '../containers/IntroductionPage';
import confirmation from '../containers/ConfirmationPage';

import prefillTransformer from './prefillTransformer';

const blankSchema = { type: 'object', properties: {} };

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

const chapters = {
  contactInformationChapter: {
    title: 'Contact information',
    pages: {
      contactInformation: {
        path: 'contact-information',
        title: 'Contact information',
        uiSchema: contactInformation.uiSchema,
        schema: contactInformation.schema,
      },
      editEmailAddress: {
        title: 'Edit email address',
        taskListHide: true,
        path: 'edit-email-address',
        CustomPage: EditEmail,
        CustomPageReview: EditEmail,
        depends: () => false,
        uiSchema: {},
        schema: blankSchema,
      },
      editMailingAddress: {
        title: 'Edit mailing address',
        taskListHide: true,
        path: 'edit-mailing-address',
        CustomPage: EditAddress,
        CustomPageReview: EditAddress,
        depends: () => false,
        uiSchema: {},
        schema: blankSchema,
      },
    },
  },
  selectSuppliesChapter: {
    title: 'Select supplies',
    pages: {
      selectSupplies: {
        path: 'select-supplies',
        title: 'Select supplies',
        uiSchema: selectSupplies.uiSchema,
        schema: selectSupplies.schema,
      },
    },
  },
};

// const formOptions = {
//   noTitle: true,
//   noTopNav: true,
//   fullWidth: true,
//   noBottomNav: true,
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
  formId: VA_FORM_IDS.FORM_VA_2346A,
  savedFormMessages,
  saveInProgress,
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  title,
  subTitle,
  customText,
  defaultDefinitions: {},
  chapters,
  getHelp,
  footerContent,
  // formOptions,
  useTopBackLink: true,
};

export default formConfig;
