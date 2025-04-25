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

import { applicantInfoIntroSchema } from '../chapters/applicantInformation';
import { onReviewPage } from '../helpers/utilities';

// import mockData from '../tests/fixtures/data/test-data.json';

import baseConfig from '../../10-10D/config/form';

const mhfc = minimalHeaderFormConfigOptions({
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
});

const baseConfigExt = { ...baseConfig, ...mhfc };

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
  ...mhfc,
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
        page13: baseConfigExt?.chapters?.applicantInformation?.pages?.page13,
        /* example of a page override: */
        page13a: {
          // initialData: mockData.data,
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
        // Explicitly listing all page objects so it'll be easier
        // when/if we need to insert a new page in between existing ones.
        page14: baseConfigExt?.chapters?.applicantInformation?.pages?.page14,
        page15a: baseConfigExt?.chapters?.applicantInformation?.pages?.page15a,
        page15: baseConfigExt?.chapters?.applicantInformation?.pages?.page15,
        page16: baseConfigExt?.chapters?.applicantInformation?.pages?.page16,
        page17: baseConfigExt?.chapters?.applicantInformation?.pages?.page17,
        page18: baseConfigExt?.chapters?.applicantInformation?.pages?.page18,
        page18c: baseConfigExt?.chapters?.applicantInformation?.pages?.page18c,
        page18a: baseConfigExt?.chapters?.applicantInformation?.pages?.page18a,
        page18d: baseConfigExt?.chapters?.applicantInformation?.pages?.page18d,
        page18e: baseConfigExt?.chapters?.applicantInformation?.pages?.page18e,
        page18b1:
          baseConfigExt?.chapters?.applicantInformation?.pages?.page18b1,
        page18b: baseConfigExt?.chapters?.applicantInformation?.pages?.page18b,
        page18b2:
          baseConfigExt?.chapters?.applicantInformation?.pages?.page18b2,
        page18f3:
          baseConfigExt?.chapters?.applicantInformation?.pages?.page18f3,
        page18f: baseConfigExt?.chapters?.applicantInformation?.pages?.page18f,
        page19: baseConfigExt?.chapters?.applicantInformation?.pages?.page19,
        page20: baseConfigExt?.chapters?.applicantInformation?.pages?.page20,
        page20a: baseConfigExt?.chapters?.applicantInformation?.pages?.page20a,
        page20b: baseConfigExt?.chapters?.applicantInformation?.pages?.page20b,
        page20c: baseConfigExt?.chapters?.applicantInformation?.pages?.page20c,
        page21: baseConfigExt?.chapters?.applicantInformation?.pages?.page21,
        page21a: baseConfigExt?.chapters?.applicantInformation?.pages?.page21a,
        page22: baseConfigExt?.chapters?.applicantInformation?.pages?.page22,
      },
    },
  },
  footerContent: GetFormHelp,
};

export default formConfig;
