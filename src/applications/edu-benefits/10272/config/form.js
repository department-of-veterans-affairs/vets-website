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
  trackingPrefix: '10272-edu-benefits',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/education',
        label: 'Education',
      },
      {
        href: '/education/other-va-education-benefits',
        label: 'Other va education benefits',
      },
      {
        href: '/education/other-va-education-benefits/reimbursements',
        label: 'Reimbursements',
      },
      {
        href:
          '/education/other-va-education-benefits/reimbursements/test-reimbursement-22-10272',
        label: 'Test reimbursement 22 10272',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_22_10272,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your 22-10272 Application for Reimbursement of Licensing or Certification Test and Preparation Course Fees application (22-10272) is in progress.',
    //   expired: 'Your saved 22-10272 Application for Reimbursement of Licensing or Certification Test and Preparation Course Fees application (22-10272) has expired. If you want to apply for 22-10272 Application for Reimbursement of Licensing or Certification Test and Preparation Course Fees, please start a new application.',
    //   saved: 'Your 22-10272 Application for Reimbursement of Licensing or Certification Test and Preparation Course Fees application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for 22-10272 Application for Reimbursement of Licensing or Certification Test and Preparation Course Fees.',
    noAuth:
      'Please sign in again to continue your application for 22-10272 Application for Reimbursement of Licensing or Certification Test and Preparation Course Fees.',
  },
  //
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  useCustomScrollAndFocus: true,
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
