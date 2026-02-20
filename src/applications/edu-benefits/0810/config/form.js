// @ts-check
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
  trackingPrefix: '0810-edu-benefits',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/education',
        label: 'Education',
      },
      {
        href: '/education/0810',
        label: '0810',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_22_0810,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your request for reimbursement of national exam fee application (22-0810) is in progress.',
    //   expired: 'Your saved request for reimbursement of national exam fee application (22-0810) has expired. If you want to apply for request for reimbursement of national exam fee, please start a new application.',
    //   saved: 'Your request for reimbursement of national exam fee application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for request for reimbursement of national exam fee.',
    noAuth:
      'Please sign in again to continue your application for request for reimbursement of national exam fee.',
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
