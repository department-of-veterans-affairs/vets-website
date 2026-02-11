// @ts-check
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../../constants';
import manifest from '../../manifest.json';
import { IntroductionPage } from '../../containers/introduction-page';
import { ConfirmationPage } from '../../containers/confirmation-page';

import nameAndDateOfBirth from '../../pages/nameAndDateOfBirth';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-2680-house-bound-status-secondary-',
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
        href: '/pension',
        label: 'Pension',
      },
      {
        href: '/pension/aid-attendance-housebound',
        label: 'Aid attendance housebound',
      },
      {
        href: '/pension/aid-attendance-housebound/apply-form-21-2680-secondary',
        label: 'Apply form 21 2680 secondary',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_21_2680_S,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your House Bound Status (Medical Professional) application (21-2680-S) is in progress.',
    //   expired: 'Your saved House Bound Status (Medical Professional) application (21-2680-S) has expired. If you want to apply for House Bound Status (Medical Professional), please start a new application.',
    //   saved: 'Your House Bound Status (Medical Professional) application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for House Bound Status (Medical Professional).',
    noAuth:
      'Please sign in again to continue your application for House Bound Status (Medical Professional).',
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
