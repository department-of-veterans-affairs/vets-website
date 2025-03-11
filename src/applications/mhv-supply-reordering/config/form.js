import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  addressSchema,
  addressUI,
  emailSchema,
  emailUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { TITLE as title, PAGE_PATH } from '../constants';
import manifest from '../manifest.json';
import CustomTopContent from '../components/CustomTopContent';

import chooseSupplies from '../pages/chooseSupplies';
import contactInformation from '../pages/contactInformation';

import EditAddress from '../components/EditAddress';
import EditEmail from '../components/EditEmail';
import EditReviewEmail from '../components/EditReviewEmail';
import EditReviewAddress from '../components/EditReviewAddress';
import getHelp from '../components/Help';

import introduction from '../containers/IntroductionPage';
import confirmation from '../containers/ConfirmationPage';

import prefillTransformer from '../utils/prefillTransformer';
import transformForSubmit from '../utils/transformForSubmit';
import submit from '../utils/submit';

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
  reviewPageTitle: 'Review order details',
  // startNewAppButtonText: '',
  submitButtonText: 'Submit',
};

const chapters = {
  chooseSuppliesChapter: {
    title: 'Select supplies',
    reviewTitle: 'Supplies selected',
    pages: {
      chooseSupplies: {
        path: 'choose-supplies',
        title: 'Available for reorder',
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
        title: 'Contact information ',
        uiSchema: contactInformation.uiSchema,
        schema: contactInformation.schema,
        onNavForward: ({ goPath }) => {
          goPath(PAGE_PATH.REVIEW_AND_SUBMIT);
        },
      },
      editEmailAddress: {
        title: 'Email address',
        path: 'edit-email-address',
        CustomPage: EditEmail,
        CustomPageReview: null,
        onNavForward: ({ goPath }) => {
          goPath(PAGE_PATH.CONTACT_INFORMATION);
        },
        onNavBack: ({ goPath }) => {
          goPath(PAGE_PATH.CONTACT_INFORMATION);
        },
        uiSchema: {
          ...titleUI('Edit email address'),
          'ui:objectViewField': EditReviewEmail,
          emailAddress: emailUI(),
        },
        schema: {
          type: 'object',
          properties: {
            emailAddress: emailSchema,
          },
          required: ['emailAddress'],
        },
      },
      editMailingAddress: {
        title: 'Shipping address',
        path: 'edit-mailing-address',
        CustomPage: EditAddress,
        CustomPageReview: null,
        onNavForward: ({ goPath, formData, setFormData }) => {
          setFormData(formData);
          goPath(PAGE_PATH.CONTACT_INFORMATION);
        },
        onNavBack: ({ goPath }) => {
          goPath(PAGE_PATH.CONTACT_INFORMATION);
        },
        uiSchema: {
          ...titleUI('Edit shipping address'),
          'ui:objectViewField': EditReviewAddress,
          permanentAddress: addressUI({ omit: ['street3'] }),
        },
        schema: {
          type: 'object',
          properties: {
            permanentAddress: addressSchema({ omit: ['street3'] }),
          },
          required: ['permanentAddress'],
        },
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
  CustomTopContent,
  useTopBackLink: true,
  backLinkText: 'Back',
  defaultDefinitions: {},
  chapters,
  getHelp,
  footerContent,
};

export default formConfig;
