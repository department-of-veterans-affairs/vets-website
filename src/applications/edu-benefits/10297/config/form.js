import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Components
import EligibilitySummary from '../components/EligibilitySummary';

// Pages
import {
  eligibilityQuestions,
  applicantFullname,
  mailingAddress,
  phoneAndEmail,
  identificationInformation,
  employmentStatus,
  employmentDetails,
  employmentFocus,
  salaryDetails,
  educationDetails,
  trainingProviderSummary,
  trainingProviderDetails,
  trainingProviderStartDate,
} from '../pages';

import { trainingProviderArrayOptions } from '../helpers';

import dateReleasedFromActiveDuty from '../pages/dateReleasedFromActiveDuty';
import activeDutyStatus from '../pages/activeDutyStatus';
import createDirectDepositPage from '../pages/DirectDeposit';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10297',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10297,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-10297) is in progress.',
    //   expired: 'Your saved education benefits application (22-10297) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    eligibilityChapter: {
      title: 'Check eligibility',
      pages: {
        eligibilityQuestions: {
          path: 'eligibility-questions',
          title: 'Eligibility questions',
          uiSchema: eligibilityQuestions.uiSchema,
          schema: eligibilityQuestions.schema,
        },
        eligibilitySummary: {
          path: 'eligibility-summary',
          title: 'Eligibility summary',
          CustomPage: EligibilitySummary,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          hideOnReview: true,
        },
      },
    },
    identificationChapter: {
      title: 'Your information',
      pages: {
        applicantFullName: {
          path: 'applicant-fullname',
          title: 'Enter your full name',
          uiSchema: applicantFullname.uiSchema,
          schema: applicantFullname.schema,
        },
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        phoneAndEmail: {
          path: 'phone-and-email',
          title: 'Phone and email address',
          uiSchema: phoneAndEmail.uiSchema,
          schema: phoneAndEmail.schema,
        },
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
        dateReleasedFromActiveDuty: {
          path: 'date-released-from-active-duty',
          title: 'Date released from active duty',
          uiSchema: dateReleasedFromActiveDuty.uiSchema,
          schema: dateReleasedFromActiveDuty.schema,
        },
        activeDutyStatus: {
          path: 'active-duty-status',
          title: 'Active duty status',
          uiSchema: activeDutyStatus.uiSchema,
          schema: activeDutyStatus.schema,
        },
        directDeposit: createDirectDepositPage(),
      },
    },
    trainingProviderChapter: {
      title: 'Training provider details',
      pages: {
        ...arrayBuilderPages(trainingProviderArrayOptions, pageBuilder => ({
          trainingProviderSummary: pageBuilder.summaryPage({
            title: 'Tell us about your training provider',
            path: 'training-provider',
            uiSchema: trainingProviderSummary.uiSchema,
            schema: trainingProviderSummary.schema,
          }),
          trainingProviderDetails: pageBuilder.itemPage({
            title: 'Training provider name and mailing address',
            path: 'training-provider/:index/details',
            uiSchema: trainingProviderDetails.uiSchema,
            schema: trainingProviderDetails.schema,
          }),
        })),
        trainingProviderStartDate: {
          path: 'training-provider-start-date',
          title:
            'Do you have a start date for the program you wish to enroll in?',
          uiSchema: trainingProviderStartDate.uiSchema,
          schema: trainingProviderStartDate.schema,
        },
      },
    },
    backgroundInformationChapter: {
      title: 'Background information',
      pages: {
        employmentStatus: {
          path: 'employment-status',
          title: 'Your employment',
          uiSchema: employmentStatus.uiSchema,
          schema: employmentStatus.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData.isEmployed === false) {
              goPath('/education-details');
            } else {
              goPath('/employment-details');
            }
          },
        },
        employmentDetails: {
          path: 'employment-details',
          title: 'Your technology industry involvement',
          uiSchema: employmentDetails.uiSchema,
          schema: employmentDetails.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData.isInTechnologyIndustry === false) {
              goPath('/salary-details');
            } else {
              goPath('/employment-focus');
            }
          },
        },
        employmentFocus: {
          path: 'employment-focus',
          title: 'Your main area of focus',
          uiSchema: employmentFocus.uiSchema,
          schema: employmentFocus.schema,
        },
        salaryDetails: {
          path: 'salary-details',
          title: 'Your current annual salary',
          uiSchema: salaryDetails.uiSchema,
          schema: salaryDetails.schema,
          onNavBack: ({ formData, goPath, goPreviousPath }) => {
            if (formData.isInTechnologyIndustry === false) {
              goPath('/employment-details');
            } else {
              goPreviousPath();
            }
          },
        },
        educationDetails: {
          path: 'education-details',
          title: 'Your education',
          uiSchema: educationDetails.uiSchema,
          schema: educationDetails.schema,
          onNavBack: ({ formData, goPath, goPreviousPath }) => {
            if (formData.isEmployed === false) {
              goPath('/employment-status');
            } else {
              goPreviousPath();
            }
          },
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
