import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE as title } from '../constants';
import manifest from '../manifest.json';

import chooseSupplies from '../pages/chooseSupplies';
import contactInformation from '../pages/contactInformation';

import EditAddress from '../components/EditAddress';
import EditEmail from '../components/EditEmail';
import getHelp from '../components/Help';

import introduction from '../containers/IntroductionPage';
import confirmation from '../containers/ConfirmationPage';

import prefillTransformer from './prefillTransformer';
import transformForSubmit from '../utils/transformForSubmit';
import submit from '../utils/submit';

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
  finishAppLaterMessage: 'Finish this order later',
  // reviewPageTitle: '',
  // startNewAppButtonText: '',
  // submitButtonText: '',
};

const chapters = {
  chooseSuppliesChapter: {
    title: 'Choose supplies',
    pages: {
      chooseSupplies: {
        path: 'choose-supplies',
        title: 'Choose supplies',
        uiSchema: chooseSupplies.uiSchema,
        schema: chooseSupplies.schema,
      },
    },
  },
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
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/mdot/supplies`,
  submit,
  transformForSubmit,
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
  customText,
  defaultDefinitions: {},
  chapters,
  getHelp,
  footerContent,
  useTopBackLink: true,
};

export default formConfig;
