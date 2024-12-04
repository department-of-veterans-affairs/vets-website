import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE as title } from '../constants';
import manifest from '../manifest.json';

import chooseSupplies from '../pages/chooseSupplies';
import contactInformation from '../pages/contactInformation';
import editEmail from '../pages/editEmail';
import editShipping from '../pages/editShipping';

// import EditAddress from '../components/EditAddress';
// import EditEmail from '../components/EditEmail';
import getHelp from '../components/Help';

import introduction from '../containers/IntroductionPage';
import confirmation from '../containers/ConfirmationPage';

import prefillTransformer from './prefillTransformer';
import { emailMissing, permanentAddressMissing } from '../utils/validators';

// const blankSchema = { type: 'object', properties: {} };

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

// https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-form-config-options#customText
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
      editEmail: {
        title: 'Edit email',
        taskListHide: true,
        path: 'edit-email',
        depends: emailMissing,
        uiSchema: editEmail.uiSchema,
        schema: editEmail.schema,
      },
      editShipping: {
        title: 'Edit shipping address',
        taskListHide: true,
        path: 'edit-shipping',
        depends: permanentAddressMissing,
        uiSchema: editShipping.uiSchema,
        schema: editShipping.schema,
      },
    },
  },
};

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
  // subTitle,
  customText,
  defaultDefinitions: {},
  chapters,
  getHelp,
  footerContent,
  useTopBackLink: true,
};

export default formConfig;
