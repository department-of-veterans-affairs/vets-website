import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import footerContent from 'platform/forms/components/FormFooter';

import {
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import contactInformation from '../pages/contactInformation';
import selectSupplies from '../pages/selectSupplies';

import EditEmail from '../pages/EditEmail';
import EditAddress from '../pages/EditAddress';

import GetHelp from '../components/GetHelp';

import { fetchSupplyData } from '../helpers/api';
import prefillTransformer from './prefill-transformer';

const blankSchema = { type: 'object', properties: {} };

const contactInformationChapter = {
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
};

const selectSuppliesChapter = {
  title: 'Select supplies',
  pages: {
    selectSupplies: {
      path: 'select-supplies',
      title: 'Select supplies',
      uiSchema: selectSupplies.uiSchema,
      schema: selectSupplies.schema,
    },
  },
};

const sipConfig = {
  prefillEnabled: true,
  // prefillTransformer,
  saveInProgress: {
    messages: {
      inProgress:
        'Your health care supply reordering application (2346) is in progress.',
      expired:
        'Your saved health care supply reordering application (2346) has expired. If you want to reorder supplies, please start a new application.',
      saved: 'Your health care supply reordering application has been saved.',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over to reorder health care supplies.',
    noAuth:
      'Please sign in again to continue your application for health care supply reordering.',
  },
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/mdot/supplies`,
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'supply-reordering',
  formId: VA_FORM_IDS.FORM_VA_2346A,
  version: 0,
  title: TITLE,
  subtitle: SUBTITLE,
  // defaultDefinitions: {},
  getHomeData: fetchSupplyData,
  introduction: IntroductionPage,
  chapters: {
    selectSuppliesChapter,
    contactInformationChapter,
  },
  confirmation: ConfirmationPage,
  getHelp: GetHelp,
  footerContent,
  ...sipConfig,
};

export default formConfig;
