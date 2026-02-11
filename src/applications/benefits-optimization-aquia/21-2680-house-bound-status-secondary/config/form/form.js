// @ts-check
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  examinationDateSchema,
  examinationDateUiSchema,
} from '@bio-aquia/21-2680-house-bound-status-secondary/pages';
import { TITLE, SUBTITLE } from '../../constants';
import manifest from '../../manifest.json';
import { IntroductionPage } from '../../containers/introduction-page';
import { ConfirmationPage } from '../../containers/confirmation-page';

import { GetHelp } from '../../components';

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
  getHelp: GetHelp,
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
    examinationOverviewChapter: {
      title: 'Examination Overview',
      pages: {
        examinationDate: {
          path: 'examination-date',
          title: 'Exam',
          uiSchema: examinationDateUiSchema,
          schema: examinationDateSchema,
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
