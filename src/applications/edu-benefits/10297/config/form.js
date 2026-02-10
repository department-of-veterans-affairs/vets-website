import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import environment from 'platform/utilities/environment';
import { TITLE, SUBTITLE, SUBMIT_URL } from '../constants';

import manifest from '../manifest.json';
import testData from '../tests/fixtures/data/maximal-test.json';
import submitForm from './submitForm';
import { transform } from './submit-transformer';

// Components
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PreSubmitInfo from '../components/PreSubmitInfo';

// Pages
import {
  applicantFullname,
  mailingAddress,
  phoneAndEmail,
  // identificationInformation,
  employmentStatus,
  employmentDetails,
  employmentFocus,
  salaryDetails,
  educationDetails,
  trainingProviderSummary,
  trainingProviderDetails,
  trainingProviderStartDate,
  atLeast3Years,
  directDeposit,
} from '../pages';

import { trainingProviderArrayOptions, focusOnH3 } from '../helpers';

import dateReleasedFromActiveDuty from '../pages/dateReleasedFromActiveDuty';
import activeDutyStatus from '../pages/activeDutyStatus';
import prefillTransformer from './prefill-transformer';
import applicantFullnameReviewPage from '../components/ApplicantFullnameReviewPage';
import NeedHelp from '../components/NeedHelp';

export const submitFormLogic = (form, formConfig) => {
  if (environment.isDev() || environment.isLocalhost()) {
    return Promise.resolve(testData);
  }
  return submitForm(form, formConfig);
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitFormLogic,
  trackingPrefix: 'edu-10297',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10297,
  saveInProgress: {
    messages: {
      inProgress: 'Your form (22-10297) is in progress.',
      expired:
        'Your saved form (22-10297) has expired. Please start a new form.',
      saved: 'Your form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  customText: {
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    startNewAppButtonText: 'Start a new form',
    finishAppLaterMessage: 'Finish this form later',
    appSavedSuccessfullyMessage: 'We’ve saved your form.',
  },
  defaultDefinitions: {},
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
    statementOfTruth: {
      // heading: 'Certification statement',
      // // body: PreSubmitInfo,
      messageAriaDescribedby: 'I have read and accept the privacy policy.',
      fullNamePath: 'applicantFullName',
      useProfileFullName: true,
    },
  },
  transformForSubmit: transform,
  useCustomScrollAndFocus: true,
  chapters: {
    identificationChapter: {
      title: 'Your information',
      pages: {
        applicantFullName: {
          path: 'applicant-fullname',
          title: 'Name and date of birth',
          uiSchema: applicantFullname.uiSchema,
          schema: applicantFullname.schema,
          CustomPageReview: applicantFullnameReviewPage,
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
        veteranStatus: {
          path: 'at-least-3-years',
          title: 'Your Veteran or service member status',
          uiSchema: atLeast3Years.uiSchema,
          schema: atLeast3Years.schema,
        },
        dateReleasedFromActiveDuty: {
          path: 'date-released-from-active-duty',
          title: 'Active duty status release date',
          uiSchema: dateReleasedFromActiveDuty.uiSchema,
          schema: dateReleasedFromActiveDuty.schema,
          depends: formData => formData?.dutyRequirement !== 'veteranStatus',
        },
        activeDutyStatus: {
          path: 'active-duty-status',
          title: 'Active duty status during program',
          uiSchema: activeDutyStatus.uiSchema,
          schema: activeDutyStatus.schema,
        },
        directDeposit: {
          path: 'direct-deposit',
          title: 'Direct deposit',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
        },
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
            scrollAndFocusTarget: focusOnH3,
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
  getHelp: NeedHelp,
  footerContent,
};

export default formConfig;
