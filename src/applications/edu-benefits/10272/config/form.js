import React from 'react';

import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  profilePersonalInfoPage,
  profileContactInfoPages,
} from 'platform/forms-system/src/js/patterns/prefill';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';

// Components
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import SubmissionInstructions from '../components/SubmissionInstructions';

// Pages
import {
  educationBenefitsElibility,
  educationBenefitsHistory,
  hasPreviouslyApplied,
  payeeNumber,
  prepCourseName,
  prepCourseAddress,
  prepCourseOnline,
  prepCoursePeriod,
  prepCourseCost,
  remarks,
} from '../pages';

import prefillTransform from './prefillTransform';

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
  formId: VA_FORM_IDS.FORM_22_10272,
  saveInProgress: {
    messages: {
      inProgress: 'Your request (22-10272) is in progress.',
      expired:
        'Your saved request (22-10272) has expired. Please start a new request.',
      saved: 'Your request has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer: prefillTransform,
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your request.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  customText: {
    appType: 'request',
    continueAppButtonText: 'Continue your request',
    startNewAppButtonText: 'Start a new request',
    finishAppLaterMessage: 'Finish this request later',
    appSavedSuccessfullyMessage: 'We’ve saved your request.',
  },
  defaultDefinitions: {},
  useCustomScrollAndFocus: true,
  chapters: {
    educationBenefitsChapter: {
      title: 'Your education benefits information',
      pages: {
        hasPreviouslyApplied: {
          path: 'previously-applied',
          title: 'Your VA education benefits',
          uiSchema: hasPreviouslyApplied.uiSchema,
          schema: hasPreviouslyApplied.schema,
        },
        educationBenefitsHistory: {
          path: 'education-benefits-history',
          title: 'Your VA education benefits history',
          uiSchema: educationBenefitsHistory.uiSchema,
          schema: educationBenefitsHistory.schema,
          depends: formData => formData?.hasPreviouslyApplied === true,
        },
        educationBenefitsEligibility: {
          path: 'education-benefits-eligibility',
          title: 'Your VA education benefits history',
          uiSchema: educationBenefitsElibility.uiSchema,
          schema: educationBenefitsElibility.schema,
          depends: formData => formData?.hasPreviouslyApplied === false,
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...profilePersonalInfoPage({
          personalInfoConfig: {
            name: { show: true, required: true },
            ssn: { show: true, required: true },
            dateOfBirth: { show: true, required: false },
          },
          dataAdapter: {
            ssnPath: 'ssn',
          },
          header: (
            <h3 className="vads-u-margin-bottom--3">
              Confirm the personal information we have on file for you
            </h3>
          ),
        }),
        payeeNumber: {
          path: 'payee-number',
          title: 'Your VA payee number',
          uiSchema: payeeNumber.uiSchema,
          schema: payeeNumber.schema,
        },
        ...profileContactInfoPages({
          content: {
            ...getContent('request'),
            title: 'Confirm the contact information we have on file for you',
          },
          contactInfoRequiredKeys: ['mailingAddress'],
        }),
      },
    },
    prepCourseChapter: {
      title: 'Prep course details',
      pages: {
        prepCourseName: {
          path: 'prep-course-details',
          title: 'The name of the prep course',
          uiSchema: prepCourseName.uiSchema,
          schema: prepCourseName.schema,
        },
        prepCourseAddress: {
          path: 'prep-course-details-1',
          title:
            'The name and mailing address of the organization giving the prep course',
          uiSchema: prepCourseAddress.uiSchema,
          schema: prepCourseAddress.schema,
        },
        prepCourseOnline: {
          path: 'prep-course-details-2',
          title: `How you'll take the prep course`,
          uiSchema: prepCourseOnline.uiSchema,
          schema: prepCourseOnline.schema,
        },
        prepCoursePeriod: {
          path: 'prep-course-details-3',
          title: 'Provide the start and end dates of your prep course',
          uiSchema: prepCoursePeriod.uiSchema,
          schema: prepCoursePeriod.schema,
        },
        prepCourseCost: {
          path: 'prep-course-details-4',
          title: 'Enter the cost of the prep course including any fees',
          uiSchema: prepCourseCost.uiSchema,
          schema: prepCourseCost.schema,
        },
      },
    },
    remarksChapter: {
      title: 'Remarks',
      pages: {
        remarks: {
          path: 'remarks',
          title: 'Enter your remarks',
          uiSchema: remarks.uiSchema,
          schema: remarks.schema,
        },
      },
    },
    submissionInstructionsChapter: {
      title: 'Submission instructions',
      hideOnReviewPage: true,
      pages: {
        submissionInstructions: {
          path: 'submission-instructions',
          title: '',
          uiSchema: {
            'ui:description': SubmissionInstructions,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
