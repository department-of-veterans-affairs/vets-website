import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SubmissionError from '../../shared/components/SubmissionError';
import GetFormHelp from '../../shared/components/GetFormHelp';
import { applicantWording } from '../../shared/utilities';

import {
  applicantInfoIntroSchema,
  applicantNameDobSchema,
} from '../chapters/applicantInformation';
import { onReviewPage } from '../helpers/utilities';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  showReviewErrors: true, // May want to hide in prod later, but for now keeping in due to complexity of this form
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  // submit: () =>
  // Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-10d-extended-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  submissionError: SubmissionError,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/ivc-champva',
        label: 'Ivc champva',
      },
      {
        href: '/ivc-champva/10-10d-extended',
        label: '10 10d extended',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_10_10D_EXTENDED,
  saveInProgress: {
    messages: {
      inProgress: 'Your CHAMPVA benefits application (10-10D) is in progress.',
      expired:
        'Your saved CHAMPVA benefits application (10-10D) has expired. If you want to apply for CHAMPVA benefits, please start a new application.',
      saved: 'Your CHAMPVA benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for CHAMPVA application (includes 10-7959c).',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA application (includes 10-7959c).',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        page13: {
          title: 'Applicant information ',
          path: 'applicant-info',
          ...applicantNameDobSchema,
        },
        page13a: {
          path: 'applicant-info-intro/:index',
          arrayPath: 'applicants',
          title: item => (
            <>
              <span className="dd-privacy-hidden">
                {applicantWording(item)}
              </span>{' '}
              information
            </>
          ),
          showPagePerItem: true,
          depends: () => !onReviewPage(),
          ...applicantInfoIntroSchema,
        },
      },
    },
  },
  footerContent: GetFormHelp,
};

export default formConfig;
